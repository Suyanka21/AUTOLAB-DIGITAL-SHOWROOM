# Explicit Human Approval Gates
**Document:** `docs/human-approval-gates.md`  
**Authority:** TODO Section 14 & Product Blueprint Section 30  
**Target Consumer:** AutoLab Leadership, Project Creator & Downstream Agents  

---

## Operating Principle

An AI agent must never invent commercial decisions, catalog offerings, or brand permissions. The following eleven decisions require **explicit human confirmation** before downstream production enters final stages:

---

## 1. The Eleven Human Approval Gates

| Gate ID | Human Decision Required | Current Proposed Baseline | Impact if Unapproved | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GATE-01** | **Exact S-Class Reference Chassis** | Mercedes-Benz S-Class (Seventh Generation — V223 Long Wheelbase). | 3D modeling cannot freeze geometry without confirmed chassis code. | **PENDING CONFIRMATION** |
| **GATE-02** | **Approved Material Catalogue** | Exclusive Nappa Leather, AutoLab Heritage Semi-Aniline, Open-Pore Poplar/Walnut, Forged Carbon. | Application might promise materials AutoLab cannot physically source. | **PENDING CONFIRMATION** |
| **GATE-03** | **Approved Leather Color Palette** | Factory codes (501A Black, 502A Sienna Brown, 505A Macchiato Beige) + AutoLab Bespoke (Cognac Tan, Royal Oxblood, Nairobi Emerald). | Color swatches must match physical workshop leather hide inventory. | **PENDING CONFIRMATION** |
| **GATE-04** | **Approved Accent Thread & Stitching** | Champagne Gold, Silver Shadow, Burnt Amber, Crimson Red in Diamond Quilt and French Seam patterns. | Stitching geometry must reflect sewing machine patterns used by AutoLab artisans. | **PENDING CONFIRMATION** |
| **GATE-05** | **Exact V1 Configuration Depth** | Primary Seat Flutes, Secondary Bolsters, Dash/Door Veneer Deck, Steering Wheel, Ambient Light Loop. | Controls customer expectation of what can be customized in the workshop. | **PENDING CONFIRMATION** |
| **GATE-06** | **AutoLab Branding & Visual Assets** | Official AutoLab vector logo, luxury wordmark, font files, and workshop portfolio photography. | Prevents generic placeholder styling in the public header and summary sheets. | **PENDING CONFIRMATION** |
| **GATE-07** | **Official Contact Destination** | AutoLab official WhatsApp Business telephone number and Nairobi showroom physical address. | Inbound lead messages and booking requests must route to real sales staff. | **PENDING CONFIRMATION** |
| **GATE-08** | **Final 3D Asset Quality Signoff** | Approval of Astra's final Blender WebGL interior mesh before public deployment. | Guarantees visual standard aligns with AutoLab's luxury brand reputation. | **PENDING CONFIRMATION** |
| **GATE-09** | **Hosting, Domain & Account Ownership** | A hosting plan that permits commercial use (see docs/ops/hosting-and-handover.md), AutoLab-owned domain, hosting and database accounts, and a named payer for running costs after delivery. | A commercial site cannot be deployed on a non-commercial plan; unclear ownership blocks handover. | **PENDING CONFIRMATION** |
| **GATE-10** | **Privacy & Data Protection Position** | AutoLab confirms it is the data controller, its ODPC registration status is checked, and the privacy notice, consent wording and retention period are approved (see docs/ops/privacy-and-data-protection.md). | The lead form collects names and phone numbers; launching without this exposes AutoLab to regulatory and reputational risk. | **PENDING CONFIRMATION** |
| **GATE-11** | **Reference Material & Third-Party Asset Licences** | Owner-captured reference photos and measurements of a real car, hide and thread swatch photos (see docs/spike/reference-capture-checklist.md), and written approval of any third-party asset (for example a studio HDRI) only after its licence text has been read. | Without ground-truth references the 3D asset cannot be checked for fidelity; unlicensed assets create IP exposure. | **PENDING CONFIRMATION** |

---

## 2. Sign-Off Execution Block

Before public deployment, each box below must be checked and dated by an authorized human stakeholder:

```text
[ ] GATE-01: S-Class V223 Chassis Baseline Confirmed
    Signed: ___________________________ Date: ____________

[ ] GATE-02: AutoLab Material Catalogue Approved
    Signed: ___________________________ Date: ____________

[ ] GATE-03: Leather & Upholstery Color Palette Approved
    Signed: ___________________________ Date: ____________

[ ] GATE-04: Accent Thread & Stitching Options Approved
    Signed: ___________________________ Date: ____________

[ ] GATE-05: V1 Configuration Depth Approved
    Signed: ___________________________ Date: ____________

[ ] GATE-06: AutoLab Brand Assets Provided
    Signed: ___________________________ Date: ____________

[ ] GATE-07: WhatsApp Number & Lead Destination Confirmed
    Signed: ___________________________ Date: ____________

[ ] GATE-08: Final 3D Asset Quality Signoff Completed
    Signed: ___________________________ Date: ____________

[ ] GATE-09: Hosting, Domain & Account Ownership Confirmed
    Signed: ___________________________ Date: ____________

[ ] GATE-10: Privacy & Data Protection Position Approved
    Signed: ___________________________ Date: ____________

[ ] GATE-11: Reference Material & Third-Party Asset Licences Approved
    Signed: ___________________________ Date: ____________
```
