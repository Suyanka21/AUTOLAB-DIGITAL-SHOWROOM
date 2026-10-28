"""Topology checks for the cross-section construction, independent of Blender."""
import math
import sys
import unittest
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'blender'))
from cockpit_surfaces import closed_loft, smooth_outline


class CockpitSurfaces(unittest.TestCase):
    def test_loft_is_closed_and_preserves_section_extents(self):
        sections = [[(x, -1, 0), (x, 0, 0), (x, 0, 1), (x, -1, 1)] for x in (-.7, 0, .7)]
        vertices, faces = closed_loft(sections)
        edges = Counter(tuple(sorted((a, b))) for f in faces for a, b in zip(f, f[1:] + f[:1]))
        self.assertTrue(all(n == 2 for n in edges.values()))
        self.assertEqual(min(p[0] for p in vertices), -.7)
        self.assertEqual(max(p[0] for p in vertices), .7)
        self.assertTrue(all(len(set(f)) == len(f) for f in faces))

    def test_outline_has_no_repeated_closure_vertex_or_zero_edge(self):
        points = smooth_outline([(-1, -1), (1, -1), (1, 1), (-1, 1)], 5)
        self.assertNotEqual(points[0], points[-1])
        for a, b in zip(points, points[1:] + points[:1]):
            self.assertGreater(math.dist(a, b), 0)
            self.assertTrue(all(math.isfinite(v) for v in a))

    def test_invalid_sections_fail_before_export(self):
        for sections in ([], [[(0, 0, 0)]], [[(0, 0, 0)] * 4, [(1, 0, 0)] * 3]):
            with self.assertRaises(ValueError): closed_loft(sections)
        with self.assertRaises(ValueError): smooth_outline([(0, 0), (1, 0)], 4)
        with self.assertRaises(ValueError): smooth_outline([(0, 0), (1, 0), (0, 1)], 0)


if __name__ == '__main__': unittest.main()
