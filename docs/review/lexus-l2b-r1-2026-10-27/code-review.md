# L2B-R1 code and evidence review

Read-only independent review used a GPT Sol reviewer as requested by the code-review skill; review feedback is advisory evidence, not visual approval.

## Finding resolved

The finalizer required ignored local rollback copies, preventing reproduction from a normal checkout. It now restores missing wheel/dashboard/combined baseline GLBs from the pinned local `dfa77e2` Git object, verifies the expected SHA-256, and preserves an existing correct copy. A mismatched existing copy fails. The Git child has a 30s timeout and a 16 MB output limit; no network is used.

Actual regression reproduction: renamed the local wheel backup, ran assembly, observed restoration, and compared restored bytes with the held original. SHA matched and the final combined asset hash was unchanged. See `evidence/rollback-restore-assembly.txt`. A shallow checkout still needs the pinned baseline commit, explicitly documented.

Historical passenger commands apply to the old source at `dfa77e2`; current R1 passenger finalization is rejected to protect the preserved seat. The old handoff now points to the current reproduction instructions.

## Other checks

- Both seats retain standalone SHA values, compressed primitive payloads, decoded geometry/transforms/materials/textures in the combined artifact.
- Seven material names and existing component/full-scene budgets remain; no gate relaxations, dependency or application edits.
- Surface construction rejects invalid and degenerate inputs; final Blender source checks closed component solids before triangulation/export.
- Render-proxy, delivered GLB, browser and gate hashes agree; packaging asserts matched camera/light settings and hashes.
- Raw failure/warning outputs and actual timing limits remain. Local software-renderer timing is not a device benchmark; GPU bytes are estimated.
- No further blocking code finding was reported. Visible trim artifacts, simplified controls and uncertain proportions remain unresolved visual issues; technical review does not approve them.

Stop for owner review; no human gate signed.
