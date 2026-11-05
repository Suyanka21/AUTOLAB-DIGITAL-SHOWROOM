#!/usr/bin/env python3
"""Crude numeric look comparison between a render and a reference photo.

Usage: python compare_to_reference.py render.png reference.png [--out report.json]
Needs numpy + Pillow. Both images are resized to the same size. Metrics are SIGNALS, not truth:
they catch gross problems (wrong proportions, flat lighting, wrong colour, no edge highlights) and
give an agent something measurable besides "looks fine". A human still decides.
"""
import json, sys
import numpy as np
from PIL import Image


def load(path, size):
    im = Image.open(path).convert("RGB").resize(size, Image.LANCZOS)
    return np.asarray(im, dtype=np.float32) / 255.0


def luminance(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def sobel(l):
    kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], np.float32)
    p = np.pad(l, 1, mode="edge")
    gx = sum(kx[i, j] * p[i:i + l.shape[0], j:j + l.shape[1]] for i in range(3) for j in range(3))
    gy = sum(kx.T[i, j] * p[i:i + l.shape[0], j:j + l.shape[1]] for i in range(3) for j in range(3))
    return np.hypot(gx, gy)


def foreground(a):
    """Foreground mask = pixels that differ from the border colour (works for studio backdrops)."""
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]).mean(0)
    return np.linalg.norm(a - border, axis=-1) > 0.08


def iou(a, b):
    inter, uni = (a & b).sum(), (a | b).sum()
    return float(inter / uni) if uni else 0.0


def hist_overlap(a, b, bins=16):
    h = lambda x: np.histogram(x, bins=bins, range=(0, 1))[0].astype(np.float64)
    ha, hb = h(a), h(b)
    ha /= ha.sum() + 1e-9; hb /= hb.sum() + 1e-9
    return float(np.minimum(ha, hb).sum())


def compare(render, reference, size=(512, 512)):
    r, f = load(render, size), load(reference, size)
    lr, lf = luminance(r), luminance(f)
    er, ef = sobel(lr), sobel(lf)
    mr, mf = foreground(r), foreground(f)

    # Use a defensible shared edge threshold anchored to salient edges in the reference
    ref_edges = ef[mf] if mf.any() else ef
    shared_thr = max(float(np.percentile(ref_edges, 85)), 1e-4)

    # Edge masks using shared reference threshold
    er_edges = er > shared_thr
    ef_edges = ef > shared_thr

    # Foreground-aware edge density comparison (advisory signal)
    r_density = float((er[mr] > shared_thr).mean()) if mr.any() else float(er_edges.mean())
    f_density = float((ef[mf] > shared_thr).mean()) if mf.any() else float(ef_edges.mean())

    out = {
        "silhouette_iou": round(iou(mr, mf), 3),
        "edge_overlap_iou": round(iou(er_edges, ef_edges), 3),
        "luminance_hist_overlap": round(hist_overlap(lr[mr] if mr.any() else lr, lf[mf] if mf.any() else lf), 3),
        "mean_colour_delta_rgb": [round(float(x), 3) for x in (r[mr].mean(0) - f[mf].mean(0))] if mr.any() and mf.any() else None,
        "edge_density_render_vs_ref": round(float(r_density / max(f_density, 1e-9)), 3),
        "highlight_fraction_render": round(float((lr[mr] > 0.85).mean()) if mr.any() else 0.0, 4),
        "highlight_fraction_ref": round(float((lf[mf] > 0.85).mean()) if mf.any() else 0.0, 4),
    }
    out["notes"] = [
        "silhouette_iou: 1.0 = identical outline. Low means proportions or camera are off.",
        "edge_overlap_iou: where the strong edges fall using shared reference threshold. Low means panel lines or forms are in the wrong places.",
        "luminance_hist_overlap: tonal range match. Low means flat or blown-out lighting.",
        "mean_colour_delta_rgb: render minus reference; large values mean wrong colour or exposure.",
        "edge_density_render_vs_ref: advisory ratio of edge pixels above shared reference threshold (<1 under-detailed, >1 noisy/over-bumped).",
        "highlight_fraction near 0 on a render means no specular life (a classic CG tell).",
    ]
    return out


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    rep = compare(sys.argv[1], sys.argv[2])
    if "--out" in sys.argv:
        json.dump(rep, open(sys.argv[sys.argv.index("--out") + 1], "w"), indent=2)
    print(json.dumps(rep, indent=2))
