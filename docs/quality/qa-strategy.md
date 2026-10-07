# Quality Assurance & Testing Strategy
**Document:** `docs/quality/qa-strategy.md`  
**Authority:** Starter Template Standards & CodeRabbit DNA  
**Target Consumer:** QA Engineers, Developers & CI/CD Pipelines  

---

## 1. Multi-Tier Verification Strategy

Quality assurance for the AutoLab Digital Showroom follows a five-tier testing pyramid:

```
[ Tier 5: Real-World Cross-Device & Mobile Field Verification ]
                          │
                          ▼
[ Tier 4: Browser DevTools & WebGL Performance Profiling ]
                          │
                          ▼
[ Tier 3: End-to-End User Journey Tests (Playwright / Cypress) ]
                          │
                          ▼
[ Tier 2: Component & Integration Tests (React Testing Library) ]
                          │
                          ▼
[ Tier 1: Static Type Checking, Schema Audits & Unit Tests ]
```

---

## 2. Test Suites by Layer

### Tier 1: Static Type & Schema Validation
* **TypeScript Check:** `tsc --noEmit` verifies strict end-to-end type conformity across `src/types/`.
* **JSON Schema Audits:** Automated test script validates `src/config/vehicles/*.json` and `scene-manifest.*.json` against `docs/schemas/*.schema.json`.
* **Reference Code Unit Tests:** Proves that the Reference Code algorithm produces identical outputs for identical configuration inputs and rejects malformed payloads.

### Tier 2: Configuration Engine Unit Tests
* Verifies material option compatibility (e.g. verifying that wood veneer cannot be assigned to seat cushion flutes).
* Verifies immutable state transitions when multiple zone updates occur in rapid succession.
* Verifies precomputed Configuration Summary accurately synthesizes all active selections.

### Tier 3: Lead Flow & Persistence Integration Tests
* Verifies enquiry submission endpoint validates input boundaries via Zod.
* Verifies anti-spam rate limiting rejects rapid automated bot submissions.
* Verifies database persistence in `configurations` and `enquiries` tables.

### Tier 4: WebGL Runtime & Chrome DevTools Profiling
* Utilizes `browser-testing-with-devtools` skill to inspect runtime WebGL draw calls, GPU memory spikes, and JS heap allocations.
* Audits console for zero WebGL warnings (e.g. `THREE.WebGLRenderer: Texture is not power of two` or shader compilation errors).
* Profiles 60fps render loop under continuous 360° orbital camera movement.

### Tier 5: Device & Browser Compatibility Matrix

| Platform / Operating System | Target Browser | Minimum Hardware Baseline | Test Focus |
| :--- | :--- | :--- | :--- |
| **macOS / Windows 11** | Google Chrome (Latest) | Dedicated / Integrated GPU | 60 FPS orbit, PBR clearcoat reflections, smooth preset transitions. |
| **macOS (Apple Silicon)** | Apple Safari (Latest) | M1 / M2 / M3 | WebGL 2.0 color management, sRGB gamma curve accuracy. |
| **Windows 11** | Microsoft Edge (Latest) | Standard Business Laptop | Keyboard navigation, accessibility rings, contrast ratios. |
| **iOS (iPhone 12 through 16)** | Mobile Safari | A14 Bionic or newer | Touch gesture damping, pinch-to-zoom limits, mobile drawer dock. |
| **Android (Samsung Galaxy / Pixel)**| Chrome Mobile | Snapdragon 888 / Tensor | WebGL context loss recovery, battery throttling resilience. |
