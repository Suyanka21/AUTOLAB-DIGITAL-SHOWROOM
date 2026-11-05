# Agent Feedback Loop

Agents render blind unless you give them a structured loop.

1. **Fixed cameras.** Same camera and lighting every round. Name them (front, three-quarter, macro).
2. **Match the reference.** Set the Blender camera to the reference's approximate focal length and viewpoint. Use the reference as a camera background image to compare proportions and panel lines.
3. **Numbers first.** `python scripts/compare_to_reference.py render.png reference.png --out report.json`. It reports silhouette overlap, edge overlap, tonal histogram overlap, colour delta, edge density and highlight fraction. These are signals. Low silhouette overlap means proportions or camera are wrong; low tonal overlap means flat or blown lighting; near-zero highlights means no specular life.
4. **Defect list, then fix three.** Write every visible defect, pick the top three, fix only those, re-render. Maximum three rounds per zone, then stop and ask a human.
5. **Human gate.** The agent never scores realism.

## Reference discipline
- Use references you own or are cleared to use. Press and publisher photos are for viewing, not for projecting into textures or for redistribution; keep them out of public repositories. Ask a lawyer about your use.
- Generated images (image models) are synthetic: label them, never take dimensions or pattern counts from them, and test a model first on a held-out real photo.

## Where AI mesh generators fit
Tools such as Tripo look realistic mostly because of baked, photo-like textures, not clean geometry. As a blockout they can save modelling time but give messy topology, invented unseen sides and no metric accuracy. If used: treat output as a rough shape, rebuild or retopologise, re-bake textures, record provenance, and check licence terms for inputs and outputs first.
