---
name: visual-fidelity-review
description: Human-in-the-loop visual acceptance for 3D output with a fixed render set, reference comparison rubric, iteration caps and a strict rule that the agent never self-certifies. Use after any 3D asset or material change and before GATE-08. Invoke explicitly with $visual-fidelity-review.
---

# Visual Fidelity Review

## Overview
Automated checks prove an asset is valid. Only people can judge whether it looks like a luxury S-Class interior. This skill produces the evidence for that judgment and stops. The agent lists defects; it never awards a pass.

## When to Use
- After any asset, material or lighting change, at each zone completion, and before GATE-08.
- When asked "does it look right?" The answer is to produce the review pack, not an opinion.

## Process
1. **Fixed render set.** Render the viewer's camera presets plus two close-ups (seat quilting and stitching, steering wheel) with the same lighting every time. Save PNGs to `docs/review/<date>/` with a contact sheet. If owner-approved reference photos exist, place each beside the matching render.
2. **Rubric (for humans to fill).** Score 0 to 3 each: recognisability as the target model; proportion; surface quality (leather reads as leather, no faceting on curves); shading artifacts (seams, z-fighting, normal errors); material plausibility against the physical hide photo; detail legibility at preset distance; overall luxury impression. Pass thresholds are agreed in writing before the review, in `docs/spike/plan.md`.
3. **Defect list (agent).** List every defect you can see, honestly, with the render file name. Do not rate or approve.
4. **Iteration cap.** At most 3 review-and-fix rounds per zone per session; each round targets a named defect list. If scores do not improve, stop and escalate.
5. **Reference discipline.** Only owner-supplied or owner-approved references. No internet downloads. Record every reference file used in the provenance file.
6. **Colour check.** Compare each rendered hide colour with the photo of the physical sample under neutral light. Flag differences; changing catalogue hex values needs owner approval.
7. **Real device.** Record the viewer on a named mid-range phone: load time and whether interaction stays smooth.
8. **Sign-off record.** Write `docs/review/<date>/review.md` with scores, reviewer names and signature lines. GATE-08 stays human.

## Common Rationalizations
| Excuse | Reality |
| :--- | :--- |
| "I compared it to reference and it matches" | Agents are poor judges of their own output. Humans score. |
| "One more polish pass will fix it" | Past 3 rounds, effort burns with no gain. Escalate. |
| "A stock texture would look better" | Unapproved assets create licence exposure. |

## Red Flags
- Any sentence like "this looks photorealistic" from the agent.
- Renders with different lighting or cameras between rounds.
- Review scores written by the agent.

## Verification
- [ ] Render set and contact sheet exist with consistent settings.
- [ ] Defect list written and no scores awarded by the agent.
- [ ] Review record exists with human names, or the phase stopped waiting for it.
