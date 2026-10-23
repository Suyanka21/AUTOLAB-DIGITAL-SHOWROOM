# L2A source review

Scope: authoring, export/finalization, Blender rendering, isolated browser probe and contact-sheet composition. Application code and dependencies are unchanged.

A separate read-only reviewer identified three evidence issues, all addressed before the final package:

1. A report field labelled `samples: 32` could overstate the achieved sample count when the time limit ends tracing. Final reports instead state `sampleLimit: 32`, the 160-second tracing limit, and `achievedSamples: null` with an explicit limitation. No achieved count is claimed.
2. The contact-sheet generator could label stale PNGs with the current asset hash. It now requires the gate/report asset hashes to match the actual GLB and every PNG hash to match its render report before composing the sheet.
3. The phrase “compressed GLB render” obscured Blender's KTX2 import limitation. Panel captions now say “delivered geometry + decoded texture pixels,” and the finalizer/render scripts verify delivered KTX payloads and the render proxy hash.

Local self-review also checked: controlled two-node scope, existing slot names and factors, applied transforms, finite geometry, positive decoded triangle areas, explicit tool timeouts, loopback-only allowlisted browser server paths, process cleanup, no embedded dealer imagery and no application modifications. The script currently preserves separately named identical ORM textures; file-size minimisation is incomplete and disclosed.

The archived round-2 report's older `samples` field also means the configured cap, not an achieved count. Final reports use the explicit corrected fields. Saved command logs have trailing whitespace normalised without changing their command output content.

This source review is not human visual acceptance. Visible defects and the owner decision are recorded in the review pack.
