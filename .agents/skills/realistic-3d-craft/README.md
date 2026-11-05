# realistic-3d-craft (skill)

Drop the folder into `.agents/skills/realistic-3d-craft/`. Invoke with `$realistic-3d-craft`.

Add this row to the skill registry in AGENTS.md and GEMINI.md (keep the two identical):

| realistic-3d-craft | `.agents/skills/realistic-3d-craft/SKILL.md` | Method for realistic 3D: six realism layers, material lab, review loop |

Try it (needs Blender 4.x or 5.x; run from `examples/`):
`blender -b --factory-startup --python crafted_seat_panel.py`

`proof/` holds the before/after renders and the grain test from the pack's own experiment.
