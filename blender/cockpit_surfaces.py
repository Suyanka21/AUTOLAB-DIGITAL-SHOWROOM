"""Closed cross-section meshes and periodic Catmull-Rom outlines; no Blender dependency."""
import math


def smooth_outline(points, steps=4):
    if len(points) < 3 or not isinstance(steps, int) or steps < 1:
        raise ValueError('An outline needs three points and positive integer sampling')
    if not all(len(p) == 2 and all(math.isfinite(v) for v in p) for p in points):
        raise ValueError('Outline coordinates must be finite 2D points')
    result = []
    for i, p1 in enumerate(points):
        p0, p2, p3 = points[i-1], points[(i+1) % len(points)], points[(i+2) % len(points)]
        for j in range(steps):
            t = j / steps
            result.append(tuple(.5*((2*p1[k])+(-p0[k]+p2[k])*t+
                (2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+
                (-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t) for k in range(2)))
    return result


def closed_loft(sections):
    if len(sections) < 2 or len(sections[0]) < 3:
        raise ValueError('A closed loft needs two rings of at least three vertices')
    n = len(sections[0])
    if any(len(s) != n for s in sections):
        raise ValueError('Loft sections must have matching topology')
    if not all(len(p) == 3 and all(math.isfinite(v) for v in p) for s in sections for p in s):
        raise ValueError('Loft coordinates must be finite 3D points')
    vertices = [tuple(p) for section in sections for p in section]
    faces = []
    for r in range(len(sections)-1):
        for i in range(n):
            a = r*n+i; b = r*n+(i+1) % n
            faces.append((a, b, b+n, a+n))
    faces.extend([tuple(reversed(range(n))), tuple((len(sections)-1)*n+i for i in range(n))])
    return vertices, faces
