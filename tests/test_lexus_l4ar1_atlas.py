"""Check generated atlas evidence independently of the clearance rasterizer.

Requires the existing L4A-R1 build outputs; does not generate assets or certify visuals.
Seam parameters come from tools/build-lexus-asset.py's original stitch paths.
"""

import json
import unittest
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "blender/out/lexus-l4ar1"


class ActualAtlasTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.atlas = json.loads((OUT / "atlas.json").read_text())
        cls.positions = np.asarray(cls.atlas["positions"]).reshape(-1, 3)
        cls.uv = np.asarray(cls.atlas["uv"]).reshape(-1, 2)
        cls.original_uv = np.asarray(cls.atlas["originalUv"]).reshape(-1, 2)
        cls.metric = np.array([cls.atlas["atlasMetresPerU"], cls.atlas["atlasMetresPerV"]])
        cls.fields = {}
        cls.alpha = {}
        for kind in ("diamond", "perforated"):
            with np.load(OUT / f"{kind}-fields.npz") as data:
                cls.fields[kind] = {key: data[key] for key in data.files}
            with Image.open(OUT / f"{kind}-orm-decoded.png") as image:
                cls.alpha[kind] = np.asarray(image.convert("RGBA"))[..., 3] / 255.0

    def panel_uv(self, panel, lateral, parameter):
        """Infer metric mapping offsets from real vertices, then map the requested point."""
        ids = np.asarray(panel["vertices"])
        original_parameter = (1.0 - self.original_uv[ids, 1]) * 0.16 / 0.60
        vertex_arc = np.interp(original_parameter, panel["parameter"], panel["arcMetres"])
        offset_u = np.median(self.uv[ids, 0] - self.positions[ids, 0] / self.metric[0])
        offset_v = np.median(self.uv[ids, 1] + vertex_arc / self.metric[1])
        arc = np.interp(parameter, panel["parameter"], panel["arcMetres"])
        return np.array([offset_u + (-0.38 + lateral) / self.metric[0],
                         offset_v - arc / self.metric[1]])

    def nearest_inside_pixel(self, point):
        """Use an interior texel near an edge, avoiding vacuous zero values outside it."""
        inside = self.fields["diamond"]["inside"]
        size = inside.shape[0]
        column, row = np.floor(point * size).astype(int)
        rows, columns = np.mgrid[max(0, row-2):min(size, row+3),
                                 max(0, column-2):min(size, column+3)]
        valid = inside[rows, columns] > 0.5
        self.assertTrue(valid.any(), f"No interior texel close to UV {point}")
        distances = np.sum(((np.stack((columns, rows), axis=-1) + 0.5) / size - point) ** 2, axis=-1)
        distances[~valid] = np.inf
        selected = np.unravel_index(np.argmin(distances), distances.shape)
        return rows[selected], columns[selected]

    def assert_excluded(self, point, label):
        row, column = self.nearest_inside_pixel(point)
        for kind, fields in self.fields.items():
            with self.subTest(kind=kind, location=label):
                self.assertLessEqual(float(fields["clearance"][row, column]), 0.004)
                for key in ("padding", "pore", "thread"):
                    self.assertAlmostEqual(float(fields[key][row, column]), 0.0, places=12)
                self.assertLessEqual(float(self.alpha[kind][row, column]), 5 / 255)

    def test_real_material_boundary_edge_midpoints_are_excluded(self):
        count = 0
        for panel in self.atlas["panels"]:
            for edge in panel["boundary"]:
                self.assert_excluded(self.uv[edge].mean(axis=0), f"{panel['name']} edge {edge}")
                count += 1
        self.assertGreater(count, 100)
        print(f"Material boundary midpoints checked: {count}")

    def test_original_cushion_transverse_stitch_paths_are_excluded(self):
        panel = next(p for p in self.atlas["panels"] if p["name"] == "cushion")
        # These lateral positions remain within the original primary insert.
        for parameter in (0.32, 0.66):
            for lateral in np.linspace(-0.12, 0.12, 31):
                self.assert_excluded(self.panel_uv(panel, lateral, parameter),
                                     f"cushion seam t={parameter}, x={lateral:.4f}")

    def test_original_backrest_arched_stitch_path_is_excluded(self):
        panel = next(p for p in self.atlas["panels"] if p["name"] == "backrest")
        # Original back(u,v) geometry and stitch_path parameterization, not atlas_clearance.
        for u in np.linspace(-0.55, 0.55, 61):
            parameter = 0.53 + 0.12 * (1 - (u / 0.58) ** 2)
            bell = lambda centre, width: np.exp(-((parameter-centre)/width)**2)
            width = (0.225 + 0.045*np.sin(np.pi*parameter)**0.8 - 0.010*parameter
                     + 0.032*bell(0.78, 0.22) - 0.012*bell(0.32, 0.20) - 0.010*bell(1, 0.08))
            self.assert_excluded(self.panel_uv(panel, u*width, parameter),
                                 f"backrest arch u={u:.4f}, t={parameter:.4f}")

    def test_metric_triangle_scale_matches_between_panels_without_uv_degeneracy(self):
        medians = []
        for panel in self.atlas["panels"]:
            triangles = np.asarray(panel["triangles"])
            xyz = self.positions[triangles]
            mapped = self.uv[triangles] * self.metric
            a, b = mapped[:, 1] - mapped[:, 0], mapped[:, 2] - mapped[:, 0]
            double_uv_area = np.abs(a[:, 0]*b[:, 1] - a[:, 1]*b[:, 0])
            double_3d_area = np.linalg.norm(np.cross(xyz[:, 1]-xyz[:, 0], xyz[:, 2]-xyz[:, 0]), axis=1)
            self.assertTrue((double_uv_area > 1e-12).all(), panel["name"])
            self.assertTrue((double_3d_area > 1e-12).all(), panel["name"])
            # Square root of area ratio is the local linear scale geometric mean.
            scale = np.sqrt(double_uv_area / double_3d_area)
            medians.append(float(np.median(scale)))
            print(f"{panel['name']} linear area-scale median={medians[-1]:.6f}, "
                  f"p05={np.quantile(scale, .05):.6f}, p95={np.quantile(scale, .95):.6f}, "
                  f"triangles={len(triangles)}")
        self.assertLess(abs(medians[0]/medians[1] - 1), 0.03)

    def test_decoded_ktx_alpha_respects_exclusion_and_survives_interior(self):
        for kind, fields in self.fields.items():
            self.assertEqual(self.alpha[kind].shape, (1024, 1024))
            excluded = (fields["inside"] == 1) & (fields["clearance"] <= 0.004)
            self.assertGreater(int(excluded.sum()), 1000)
            values = self.alpha[kind][excluded]
            print(f"{kind} exclusion alpha max={values.max():.6f}, mean={values.mean():.6f}, "
                  f"pixels={len(values)}")
            self.assertLessEqual(float(values.max()), 5/255)
            self.assertLessEqual(float(values.mean()), 1/255)
        fields = self.fields["diamond"]
        interior_thread = (fields["clearance"] > 0.014) & (fields["thread"] > 0.25)
        self.assertGreater(int(interior_thread.sum()), 100)
        self.assertGreater(float(self.alpha["diamond"][interior_thread].mean()), 0.2)
        self.assertEqual(float(self.alpha["perforated"].max()), 0.0)

    def test_decoded_thread_channel_matches_source_field_orientation(self):
        source = self.fields["diamond"]["thread"]
        decoded = self.alpha["diamond"]
        error = float(np.mean(np.abs(source-decoded)))
        flipped_error = float(np.mean(np.abs(source[::-1]-decoded)))
        print(f"Diamond thread mean absolute error={error:.6f}; flipped={flipped_error:.6f}")
        self.assertLess(error, 2/255)
        self.assertLess(error, flipped_error/4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
