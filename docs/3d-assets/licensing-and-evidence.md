# Evidence, Licensing & Intellectual Property Governance
**Document:** `docs/3d-assets/licensing-and-evidence.md`  
**Authority:** TODO Section 15 & Mercedes Report Section I  
**Target Consumer:** Downstream Agents & Legal / Project Governance  

---

## 1. Distinction: Reference Material vs. Production Asset

A fundamental legal distinction governs all digital material in this repository:

| Classification | Definition | Permitted Usage | Examples |
| :--- | :--- | :--- | :--- |
| **Reference Material** | Publicly accessible documentation, press kits, photographs, and video reviews used by engineers to understand geometry and calibrate dimensions. | **Inspection and proportional measurement ONLY.** Must NOT be bundled into public production binaries. | Mercedes-Benz press releases, Autogefühl YouTube reviews, MBWorld dealer order guides. |
| **Production Asset** | Meshes, textures, audio, shaders, and code files compiled into the client-facing WebGL application bundle. | **Must possess full commercial clearance or be authored completely from scratch in-house.** | In-house Blender `.glb` models, bespoke PBR texture maps, application source code. |

---

## 2. Licensing Evaluation of External 3D Candidates

| Candidate / Source | Listed License Type | Commercial WebGL Deployment Permitted? | Assessment & Directives |
| :--- | :--- | :--- | :--- |
| **In-House Blender Reconstruction** | Proprietary AutoLab | **YES (Fully Cleared)** | **Primary Route.** Zero external licensing liability. |
| **Hum3D S-Class LWB (Model ID: h3dA227378)** | Commercial Royalty-Free ($295 / $885) | **YES (If Formally Purchased)** | **Approved Contingency.** Sole commercial stock model legally viable for web configurators. |
| **TurboSquid S-Class Assets** | Editorial Use Only | **STRICTLY PROHIBITED** | Legal risk. Editorial licenses explicitly prohibit commercial software distribution. |
| **CGTrader Standard Assets** | Editorial Use / CGTrader Standard | **STRICTLY PROHIBITED** | Most high-poly models carry editorial disclaimers forbidding interactive commercial use. |

---

## 3. Brand Trademarks & Automotive IP Protection

### 3.1 Protected Intellectual Property
The following trademarks are proprietary assets of Mercedes-Benz Group AG and Burmester Audiosysteme GmbH:
* The Mercedes-Benz Three-Pointed Star logo.
* The "Maybach" double-M emblem.
* The "S-Class" wordmark and typography.
* The "MBUX" user interface layouts and system graphics.
* The "Burmester" audio script badging.

### 3.2 Defensive Technical Enforcement
1. **Isolated Nodes:** All brand emblems on steering wheel hubs, headrests, and speaker grilles must reside on dedicated detachable child nodes (`GEO_Logo_Steering_Boss`).
2. **Neutral Default Configuration:** By default, the production WebGL asset renders an elegant, unbranded brushed titanium boss cap or an **AutoLab Atelier Insignia**.
3. **No Trademark Infringement:** The configurator application celebrates AutoLab's bespoke interior craft on client-owned vehicles, functioning under repair, customization, and aftermarket descriptive fair-use doctrines without falsely presenting itself as an official Mercedes-Benz dealership.
