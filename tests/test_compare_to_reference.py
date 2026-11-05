"""Targeted unit tests for compare_to_reference.py edge density and comparison metrics."""

import os
import sys
import unittest

# Ensure the script directory is importable
SCRIPT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", ".agents", "skills", "realistic-3d-craft", "scripts")
)
PROOF_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", ".agents", "skills", "realistic-3d-craft", "proof")
)
sys.path.insert(0, SCRIPT_DIR)

import compare_to_reference  # noqa: E402


class TestCompareToReference(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.img_before_after = os.path.join(PROOF_DIR, "before_after.png")
        cls.img_grain_lab = os.path.join(PROOF_DIR, "grain_lab_A_vs_B.png")

        if not os.path.exists(cls.img_before_after) or not os.path.exists(cls.img_grain_lab):
            raise unittest.SkipTest("Proof images not found in realistic-3d-craft skill directory.")

    def test_identical_image_produces_unity_ratio(self):
        """Comparing an image to itself must yield unity across all similarity metrics."""
        result = compare_to_reference.compare(self.img_before_after, self.img_before_after)
        self.assertEqual(result["edge_density_render_vs_ref"], 1.0)
        self.assertEqual(result["silhouette_iou"], 1.0)
        self.assertEqual(result["edge_overlap_iou"], 1.0)
        self.assertEqual(result["luminance_hist_overlap"], 1.0)

    def test_shared_threshold_differentiates_edge_densities(self):
        """A detailed render vs a different reference must produce an informative, non-unity edge density ratio."""
        # Comparing before_after (denser edges) vs grain_lab (macro, sparser edges)
        res_denser = compare_to_reference.compare(self.img_before_after, self.img_grain_lab)
        self.assertGreater(
            res_denser["edge_density_render_vs_ref"],
            1.5,
            f"Expected ratio > 1.5 for denser render, got {res_denser['edge_density_render_vs_ref']}",
        )

        # Comparing grain_lab vs before_after must show low edge density ratio (< 0.5)
        res_sparser = compare_to_reference.compare(self.img_grain_lab, self.img_before_after)
        self.assertLess(
            res_sparser["edge_density_render_vs_ref"],
            0.5,
            f"Expected ratio < 0.5 for sparser render, got {res_sparser['edge_density_render_vs_ref']}",
        )

    def test_notes_contain_edge_density_advisory(self):
        """Notes must clearly state that edge density is an advisory signal."""
        result = compare_to_reference.compare(self.img_before_after, self.img_before_after)
        self.assertTrue(any("edge_density_render_vs_ref" in n for n in result["notes"]))


if __name__ == "__main__":
    unittest.main()
