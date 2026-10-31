"""Physical-coordinate material contracts; these do not award visual approval."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "blender"))
from lexus_l4ar1_materials import surface_fields


class SurfaceFieldsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # 0.2 mm sampling across several pillows and many pores; metres throughout.
        cls.x, cls.s = np.meshgrid(
            np.linspace(-0.05, 0.05, 501), np.linspace(0.0, 0.14, 701)
        )
        cls.clearance = np.full_like(cls.x, 0.025)
        cls.interior = {
            kind: surface_fields(kind, cls.x, cls.s, cls.clearance)
            for kind in ("diamond", "perforated")
        }

    def test_fields_are_finite_scalar_arrays_with_physical_and_unit_ranges(self):
        required = {"height", "padding", "thread", "pore", "grain", "base", "roughness", "ao"}
        for kind, fields in self.interior.items():
            self.assertTrue(required.issubset(fields), kind)
            for name in required:
                with self.subTest(kind=kind, field=name):
                    self.assertEqual(fields[name].shape, self.x.shape)
                    self.assertTrue(np.isfinite(fields[name]).all())
            for name in ("thread", "pore", "base", "roughness", "ao"):
                with self.subTest(kind=kind, unit_interval=name):
                    self.assertGreaterEqual(float(fields[name].min()), 0.0)
                    self.assertLessEqual(float(fields[name].max()), 1.0)
            # Broad sanity limits catch unit mistakes without claiming OEM dimensions.
            self.assertLess(float(np.abs(fields["height"]).max()), 0.02)
            self.assertGreaterEqual(float(fields["padding"].min()), 0.0)
            self.assertLess(float(fields["padding"].max()), 0.02)

    def test_real_panel_and_seam_clearance_suppresses_relief_at_and_inside_band(self):
        for kind in self.interior:
            for distance in (-0.001, 0.0, 0.0039, 0.004):
                fields = surface_fields(kind, self.x, self.s, np.full_like(self.x, distance))
                for name in ("padding", "thread", "pore"):
                    with self.subTest(kind=kind, clearance=distance, field=name):
                        np.testing.assert_array_equal(fields[name], np.zeros_like(self.x))

    def test_interior_detail_survives_the_exclusion_band(self):
        for kind, names in (("diamond", ("padding", "thread", "pore")), ("perforated", ("pore",))):
            for name in names:
                with self.subTest(kind=kind, field=name):
                    self.assertGreater(float(self.interior[kind][name].max()), 0.0)
        for kind, fields in self.interior.items():
            with self.subTest(kind=kind):
                self.assertGreater(float(np.ptp(fields["grain"])), 0.0)

    def test_diamond_padding_has_a_rounded_convex_crown(self):
        padding = self.interior["diamond"]["padding"]
        # Locate a crown from the field instead of depending on implementation phase.
        inset = 10
        row, col = np.unravel_index(np.argmax(padding[inset:-inset, inset:-inset]),
                                   padding[inset:-inset, inset:-inset].shape)
        row, col = row + inset, col + inset
        crown = float(padding[row, col])
        self.assertGreater(crown, 0.002, "Provisional relief must exceed the flat prototype")
        for dr, dc in ((2, 0), (0, 2)):
            left = float(padding[row - dr, col - dc])
            right = float(padding[row + dr, col + dc])
            self.assertGreater(crown, (left + right) / 2,
                               "The crown must curve down in both panel directions")
            self.assertGreater(min(left, right), crown * 0.9,
                               "Padding must form a broad pillow, not an isolated spike")
        middle = (padding > crown * 0.2) & (padding < crown * 0.8)
        self.assertGreater(float(middle.mean()), 0.1, "Padding needs gradual curved shoulders")

    def test_perforated_pores_have_distinct_dark_interiors_and_neutral_base(self):
        fields = self.interior["perforated"]
        pore = fields["pore"]
        peak = float(pore.max())
        self.assertGreater(peak, 0.5, "Pore interiors must be resolved by the physical field")
        holes = pore > peak * 0.8
        leather = pore < peak * 0.05
        self.assertTrue(holes.any())
        self.assertTrue(leather.any())
        self.assertLess(float(holes.mean()), 0.35, "Apertures must remain smaller than their pitch")
        # A single scalar per texel is neutral and can be recoloured without baked hue.
        self.assertEqual(fields["base"].shape, self.x.shape)
        self.assertLess(float(fields["base"][holes].mean()),
                        float(fields["base"][leather].mean()) - 0.1)

    def test_material_generation_is_deterministic(self):
        for kind, expected in self.interior.items():
            actual = surface_fields(kind, self.x, self.s, self.clearance)
            for name in expected:
                with self.subTest(kind=kind, field=name):
                    np.testing.assert_array_equal(actual[name], expected[name])

    def test_unknown_treatment_is_rejected(self):
        with self.assertRaises(ValueError):
            surface_fields("workshop-certified", np.zeros((2, 2)),
                           np.zeros((2, 2)), np.ones((2, 2)))


if __name__ == "__main__":
    unittest.main()
