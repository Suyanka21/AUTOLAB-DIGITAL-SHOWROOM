# 3D Viewer & Application Integration Requirements
**Document:** `docs/3d-assets/viewer-and-integration-requirements.md`  
**Authority:** Product Blueprint & Decision Freeze (Sections 18 & 19)  
**Target Consumer:** Frontend WebGL Engineers & Astra  

---

## 1. Real-Time 3D Rendering Architecture

The Digital Showroom embeds an interactive 3D WebGL canvas built on **Three.js / React Three Fiber (R3F)**. The viewer must decouple 3D rendering from React DOM state changes to prevent unnecessary canvas re-renders and frame drops.

### Core Rendering Pipeline
* **Renderer:** `WebGLRenderer` with `antialias: true`, `powerPreference: "high-performance"`.
* **Tone Mapping:** `ACESFilmicToneMapping` with exposure calibrated to `1.05`.
* **Color Space:** `sRGBEncoding` (WebGL standard linear-to-sRGB output).
* **Shadows:** Soft PCF shadows enabled for interior ambient grounding (`pcfSoftShadowMap`).
* **Environment:** Curated studio HDRI environment map (subtle warm interior softboxes) producing realistic specular highlights on leather and lacquer without harsh outdoor daylight.

---

## 2. Camera Controls & Viewpoint Boundaries

To prevent disorienting the customer (e.g., clipping through the vehicle floor or flipping upside down):
* **Controls:** `OrbitControls` with smooth damping enabled (`dampingFactor: 0.05`).
* **Polar Angle Limits:** Constrained between `15°` (overhead downward angle) and `105°` (prevent looking underneath the floor).
* **Azimuth Angle Limits:** Bounded to 360° interior orbit or clamped per sub-view.
* **Distance Bounds:** `minDistance: 0.35m`, `maxDistance: 2.80m` (prevents clipping inside seat bolsters or escaping vehicle cabin).

---

## 3. Calibrated Viewpoint Presets

The viewer exposes quick-action preset buttons in the UI. Transitioning between viewpoints uses smooth cubic-bezier camera interpolation (duration: ~1200ms):

| Preset Identifier | Display Name | Camera Position `[x, y, z]` | Target Center `[x, y, z]` | Field of View (FOV) | Primary Focal Subject |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cam_cockpit_master` | Cockpit Master | `[0.00, 1.15, 0.25]` | `[0.00, 0.95, -0.65]` | 45° | Full dashboard sweep, 12.8" OLED, steering wheel |
| `cam_steering_cluster` | Driver Cockpit | `[-0.38, 1.12, 0.05]` | `[-0.38, 1.02, -0.55]` | 38° | 12.3" cluster, AMG double-spoke wheel, perforated grip |
| `cam_center_console` | Center Console | `[0.15, 1.18, -0.10]` | `[0.00, 0.88, -0.45]` | 40° | Waterfall console, tambour lid, cupholder bay |
| `cam_front_seats` | Front Seating | `[0.75, 1.10, 0.20]` | `[0.00, 0.85, 0.00]` | 42° | Multicontour bolsters, diamond-quilted cushion flutes |
| `cam_rear_executive` | Rear Executive Suite| `[0.25, 1.15, 0.95]` | `[0.42, 0.85, 1.35]` | 46° | Reclining seat, powered calf rest, business console |
| `cam_night_ambient` | Night Ambient Mode | `[0.00, 1.08, 0.45]` | `[0.00, 0.95, -0.65]` | 52° | 253-LED continuous optical fiber arc bloom |

---

## 4. Live Material Swapping Protocol

When the user selects a material, color, or trim option in the UI:
1. The configurator state dispatches a zone update event: `{ zoneId: 'zone_primary_upholstery', materialId: 'nappa-exclusive', colorHex: '#75452B' }`.
2. The 3D scene manager queries the targeted material slot (`MAT_Upholstery_Primary`).
3. Rather than reloading the 3D model, the manager directly mutates the material properties:
   * Updates `material.color.set(colorHex)`.
   * Updates `material.roughness = targetRoughness`.
   * Swaps normal/roughness textures if the material category changes (e.g., swapping wood for carbon fiber).
   * Flags `material.needsUpdate = true`.
4. The swap occurs in a single animation frame (< 16ms), delivering instantaneous visual feedback.

---

## 5. WebGL Context Loss & Recovery

Mobile browsers under memory pressure frequently drop WebGL contexts. The application must include defensive guards:
* Listen for `webglcontextlost` on the canvas: Cancel render loop, display graceful fallback UI card (*"Graphics context paused — resuming..."*).
* Listen for `webglcontextrestored`: Re-instantiate Three.js scene, reload GLB from browser cache, restore last active configuration state.
