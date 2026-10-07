# Performance Specification & Device Budgets
**Document:** `docs/quality/performance-requirements.md`  
**Authority:** TODO Section 17 & Starter Template Standards  
**Target Consumer:** WebGL Developers, Astra & QA Team  

---

## 1. WebGL & Asset Performance Thresholds

To ensure flawless operation across both flagship desktop workstations and mid-range mobile devices, the 3D interior configurator must strictly conform to the following performance envelope:

| Performance Metric | Desktop Benchmark | Mobile Benchmark (iOS / Android) | Hard Maximum Threshold |
| :--- | :--- | :--- | :--- |
| **Target Frame Rate** | **60 FPS** (Rock solid) | **30 – 60 FPS** (No stuttering) | Minimum 30 FPS under active orbit |
| **Polygon / Triangle Count** | < 250,000 tris | < 180,000 tris (via LOD/culling)| **350,000 tris** |
| **Draw Call Count** | < 45 draw calls | < 40 draw calls | **65 draw calls** |
| **Master Asset File Size** | < 5.0 MB (Draco / KTX2) | < 5.0 MB | **15.0 MB uncompressed** |
| **GPU Texture VRAM** | < 96 MB VRAM | < 64 MB VRAM | **128 MB VRAM** |
| **Initial Time-to-Interactive**| < 2.0s (Fast Broadband) | < 3.5s (4G Mobile) | **5.0s maximum initial load** |

---

## 2. Asset Compression & Delivery Standards

### 2.1 Draco Geometry Compression
* All production GLB assets must be compressed with Google Draco.
* Quantization bit targets:
  * Position: `14 bits`
  * Normal: `10 bits`
  * Texture Coordinates: `12 bits`
* Yields an ~80% reduction in raw geometry transmission size without noticeable mesh degradation.

### 2.2 Texture Optimization & KTX2
* Textures must be transcoded using **Basis Universal / KTX2 (`KHR_texture_basisu`)**.
* GPU-native texture compression (BC7 for desktop, ASTC for iOS/Android) eliminates client-side CPU texture decompression and cuts GPU VRAM consumption by 75%.
* WebP format is retained as an automatic fallback for legacy browsers without WebGL KTX2 extension support.

---

## 3. Memory Lifecycle & Garbage Collection

WebGL memory leaks are the primary cause of browser tab crashes. The frontend viewer must implement defensive cleanup:
1. **Dispose Geometry:** When models are unmounted, invoke `geometry.dispose()` on every mesh.
2. **Dispose Textures:** Explicitly call `texture.dispose()` on every diffuse, normal, roughness, and metalness map when swapped.
3. **Dispose Render Targets:** Free shadow maps and PMREM environment textures during page transitions.
4. **Context Loss Guard:** Automatically throttle rendering or reduce resolution scale (`pixelRatio = 1.0`) on detected mobile low-power states.
