"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial, PMREMGenerator, PerspectiveCamera, type Texture } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { KTX2Loader } from "three-stdlib";
import { SPIKE_CAMERA_PRESETS, type CameraViewId } from "@/config/spike-camera-presets";
import { LEXUS_CAMERA_PRESETS } from "@/config/lexus-camera-presets";

const ALL_CAMERA_PRESETS: Record<string, {
  target: readonly [number, number, number];
  position: readonly [number, number, number];
  fov?: number;
}> = {
  ...SPIKE_CAMERA_PRESETS,
  ...LEXUS_CAMERA_PRESETS,
};

// Sources: https://r3f.docs.pmnd.rs/api/canvas,
// https://drei.docs.pmnd.rs/loaders/gltf-use-gltf,
// https://threejs.org/docs/pages/RoomEnvironment.html,
// https://threejs.org/docs/pages/GLTFLoader.html.
const LEXUS_L2B_ASSET_URL = "/assets/3d/lexus-rx350/interior-l2b.glb";
const LEXUS_L2A_ASSET_URL = "/assets/3d/lexus-rx350/driver-seat-l2a.glb";
const MERCEDES_SPIKE_ASSET_URL = "/assets/3d/s-class-v223/spike.glb";

// Active Lexus RX 350 L2B interior assembly contract (all 7 slots)
const LEXUS_SEAT_PRIMARY = "MAT_Seat_Primary";
const LEXUS_SEAT_SECONDARY = "MAT_Seat_Secondary";
const LEXUS_SEAT_STITCHING = "MAT_Seat_Stitching";
const LEXUS_STEERING_LEATHER = "MAT_Steering_Leather";
const LEXUS_DASHBOARD_TRIM = "MAT_Dashboard_Trim";
const LEXUS_COCKPIT_ACCENT = "MAT_Cockpit_Accent";
const LEXUS_COCKPIT_BLACK = "MAT_Cockpit_Black";

// Legacy Mercedes-Benz S-Class spike contract (preserved for historical regression)
const LEGACY_SEAT_SLOT = "MAT_Upholstery_Primary";
const LEGACY_OLED_SLOT = "MAT_Screen_Central_OLED";

type ViewerStatus = "loading" | "success" | "empty" | "error";
export type RendererStats = { calls: number; triangles: number; textures: number; geometries: number };
type MaterialState = { bindings: Record<string, string>; colors: Record<string, string> };
export type ViewerEvidence = {
  status: ViewerStatus;
  assetUrl: string;
  materialState: MaterialState | null;
  renderer: RendererStats | null;
  error: string | null;
  cameraFov?: number;
};

declare global {
  interface Window {
    __autolab?: { snapshot: () => ViewerEvidence; loseContext: () => boolean };
  }
}

function testParam(key: string) {
  return process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has(key);
}

function getAssetUrl() {
  if (testParam("missing-spike") || testParam("missing-asset")) {
    return "/assets/3d/lexus-rx350/missing-asset.glb";
  }
  if (testParam("legacy-spike") || testParam("s-class")) {
    return MERCEDES_SPIKE_ASSET_URL;
  }
  if (testParam("l2a-driver-seat") || testParam("driver-seat-only")) {
    return LEXUS_L2A_ASSET_URL;
  }
  return LEXUS_L2B_ASSET_URL;
}

function RoomLighting() {
  const { gl, invalidate } = useThree();
  const [environment, setEnvironment] = useState<Texture | null>(null);
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room);
    const frame = window.requestAnimationFrame(() => { setEnvironment(target.texture); invalidate(); });
    return () => {
      window.cancelAnimationFrame(frame);
      target.dispose();
      generator.dispose();
      room.dispose();
    };
  }, [gl, invalidate]);
  return <>{environment && <primitive attach="environment" object={environment} />}<ambientLight intensity={0.35} /><directionalLight position={[-1.5, 2.2, 1.5]} intensity={1.6} /></>;
}

function syncCameraRig(
  cam: unknown,
  ctrls: React.ElementRef<typeof OrbitControls> | null,
  preset: { position: readonly [number, number, number]; target: readonly [number, number, number]; fov?: number },
) {
  if (cam instanceof PerspectiveCamera) {
    cam.position.set(preset.position[0], preset.position[1], preset.position[2]);
    const targetFov = preset.fov ?? 38;
    if (cam.fov !== targetFov) {
      cam.fov = targetFov;
    }
    cam.updateProjectionMatrix();
  }
  ctrls?.target.set(preset.target[0], preset.target[1], preset.target[2]);
  ctrls?.update();
}

function CameraRig({ view }: { view: CameraViewId }) {
  const { camera, invalidate } = useThree();
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const preset = ALL_CAMERA_PRESETS[view] ?? SPIKE_CAMERA_PRESETS.overview;
    syncCameraRig(camera, controls.current, preset);
    invalidate();
  }, [camera, invalidate, view]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reducedMotion}
    minDistance={0.35} maxDistance={4} minPolarAngle={0.15} maxPolarAngle={Math.PI * 0.82} />;
}

interface ExtractedModel {
  isLexus: boolean;
  isCompleteAssembly: boolean;
  materials: Record<string, MeshStandardMaterial>;
  bindings: Record<string, string>;
}

function modelMaterials(scene: Group): ExtractedModel | null {
  const materials: Record<string, MeshStandardMaterial> = {};
  const bindings: Record<string, string> = {};

  scene.traverse((object) => {
    if (object instanceof Mesh) {
      const mats = Array.isArray(object.material) ? object.material : [object.material];
      for (const m of mats) {
        if (m instanceof MeshStandardMaterial && m.name) {
          materials[m.name] = m;
          bindings[object.name] = m.name;
        }
      }
    }
  });

  const materialNames = Object.keys(materials);
  if (materialNames.length === 0) return null;

  // Active Lexus RX 350 Assembly (7-slot L2B interior or 3-slot L2A driver-seat rollback)
  if (materials[LEXUS_SEAT_PRIMARY]) {
    if (!materials[LEXUS_SEAT_SECONDARY] || !materials[LEXUS_SEAT_STITCHING]) {
      throw new Error("Lexus asset is missing required secondary or stitching material slot");
    }
    const isComplete = Boolean(
      materials[LEXUS_STEERING_LEATHER] &&
      materials[LEXUS_DASHBOARD_TRIM] &&
      materials[LEXUS_COCKPIT_ACCENT] &&
      materials[LEXUS_COCKPIT_BLACK]
    );
    return { isLexus: true, isCompleteAssembly: isComplete, materials, bindings };
  }

  // Legacy Mercedes Spike compatibility (preserved for historical regression)
  if (materials[LEGACY_SEAT_SLOT]) {
    if (!materials[LEGACY_OLED_SLOT]) {
      throw new Error("Legacy Mercedes spike missing OLED material contract");
    }
    return { isLexus: false, isCompleteAssembly: false, materials, bindings };
  }

  throw new Error("Unrecognized 3D asset material contract: " + materialNames.join(", "));
}

function SpikeModel({
  url,
  primaryHex,
  secondaryHex = primaryHex,
  threadHex = "#D4AF37",
  trimHex = "#2A2B2E",
  steeringHex = secondaryHex,
  accentHex = "#787D82",
  cockpitBlackHex = "#121316",
  onLoaded,
  onStats,
}: {
  url: string;
  primaryHex: string;
  secondaryHex?: string;
  threadHex?: string;
  trimHex?: string;
  steeringHex?: string;
  accentHex?: string;
  cockpitBlackHex?: string;
  onLoaded: (state: MaterialState | null) => void;
  onStats: (stats: RendererStats) => void;
}) {
  const { gl, invalidate } = useThree();

  // Local Draco and KTX2 loader configuration
  const { scene } = useGLTF(url, "/draco/", false, (loader) => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/basis/");
    ktx2Loader.detectSupport(gl);
    loader.setKTX2Loader(ktx2Loader);
  }) as { scene: Group };

  const parsed = useMemo(() => modelMaterials(scene), [scene]);

  useEffect(() => {
    if (!parsed) {
      onLoaded(null);
      return;
    }
    const colorMap: Record<string, string> = {};
    for (const [name, mat] of Object.entries(parsed.materials)) {
      colorMap[name] = "#" + mat.color.getHexString();
    }
    onLoaded({
      bindings: parsed.bindings,
      colors: colorMap,
    });
  }, [parsed, onLoaded]);

  useEffect(() => {
    if (!parsed) return;
    const { materials, bindings, isLexus } = parsed;

    if (isLexus) {
      if (!testParam("break-seat-binding") && materials[LEXUS_SEAT_PRIMARY]) {
        materials[LEXUS_SEAT_PRIMARY].color.set(primaryHex);
      }
      if (materials[LEXUS_SEAT_SECONDARY]) {
        materials[LEXUS_SEAT_SECONDARY].color.set(secondaryHex);
      }
      if (materials[LEXUS_SEAT_STITCHING]) {
        materials[LEXUS_SEAT_STITCHING].color.set(threadHex);
      }
      if (materials[LEXUS_STEERING_LEATHER]) {
        materials[LEXUS_STEERING_LEATHER].color.set(steeringHex ?? secondaryHex);
      }
      if (materials[LEXUS_DASHBOARD_TRIM]) {
        materials[LEXUS_DASHBOARD_TRIM].color.set(trimHex ?? "#2A2B2E");
      }
      if (materials[LEXUS_COCKPIT_ACCENT]) {
        materials[LEXUS_COCKPIT_ACCENT].color.set(accentHex ?? "#787D82");
      }
      if (materials[LEXUS_COCKPIT_BLACK]) {
        materials[LEXUS_COCKPIT_BLACK].color.set(cockpitBlackHex ?? "#121316");
      }
    } else {
      if (!testParam("break-seat-binding") && materials[LEGACY_SEAT_SLOT]) {
        materials[LEGACY_SEAT_SLOT].color.set(primaryHex);
      }
    }

    invalidate();

    const timer = window.setTimeout(() => {
      const colorMap: Record<string, string> = {};
      for (const [name, mat] of Object.entries(materials)) {
        colorMap[name] = "#" + mat.color.getHexString();
      }
      onLoaded({
        bindings,
        colors: colorMap,
      });
      onStats({
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures,
        geometries: gl.info.memory.geometries,
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [parsed, primaryHex, secondaryHex, threadHex, trimHex, steeringHex, accentHex, cockpitBlackHex, invalidate, onLoaded, onStats, gl]);

  return <primitive object={scene} />;
}

class SceneBoundary extends React.Component<{ children: React.ReactNode; onError: (message: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function SpikeViewer({
  view,
  primaryHex,
  secondaryHex = primaryHex,
  threadHex = "#D4AF37",
  trimHex = "#2A2B2E",
  steeringHex = secondaryHex,
  accentHex = "#787D82",
  cockpitBlackHex = "#121316",
  onStatus,
  onStats,
}: {
  view: CameraViewId;
  primaryHex: string;
  secondaryHex?: string;
  threadHex?: string;
  trimHex?: string;
  steeringHex?: string;
  accentHex?: string;
  cockpitBlackHex?: string;
  onStatus: (status: ViewerStatus) => void;
  onStats: (stats: RendererStats | null) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [materialState, setMaterialState] = useState<MaterialState | null>(null);
  const [renderer, setRenderer] = useState<RendererStats | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const contextRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const url = getAssetUrl();
  const fail = useCallback((message: string) => {
    setError(message);
    setStatus("error");
    onStatus("error");
    onStats(null);
  }, [onStatus, onStats]);
  const loaded = useCallback((state: MaterialState | null) => {
    if (!state) { setStatus("empty"); onStatus("empty"); return; }
    setMaterialState(state);
    setStatus("success");
    onStatus("success");
  }, [onStatus]);
  const stats = useCallback((value: RendererStats) => { setRenderer(value); onStats(value); }, [onStats]);

  useEffect(() => {
    const probeTimer = window.setTimeout(() => {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2");
      if (!context) { fail("WebGL2 is unavailable"); return; }
      context.getExtension("WEBGL_lose_context")?.loseContext();
      setSupported(true);
    }, 0);
    return () => { window.clearTimeout(probeTimer); cleanupRef.current?.(); };
  }, [fail]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E !== "1") return;
    const currentFov = (ALL_CAMERA_PRESETS[view] ?? SPIKE_CAMERA_PRESETS.overview).fov ?? 38;
    window.__autolab = {
      snapshot: () => ({ status, assetUrl: url, materialState, renderer, error, cameraFov: currentFov }),
      loseContext: () => {
        const extension = contextRef.current?.getExtension("WEBGL_lose_context");
        if (!extension) return false;
        extension.loseContext();
        return true;
      },
    };
    return () => { delete window.__autolab; };
  }, [status, url, materialState, renderer, error, view]);

  const retry = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setError(null); setMaterialState(null); setRenderer(null);
    setStatus("loading"); onStatus("loading"); onStats(null);
    setRetryKey((value) => value + 1);
  };

  return <div className="absolute inset-0 z-10" style={{ backgroundColor: status === "success" ? "#0F1014" : "transparent" }}
    data-testid="spike-viewer" aria-label="2020 Lexus RX 350 interactive 3D interior viewer">
    {supported && status !== "error" && status !== "empty" && <Canvas key={retryKey} frameloop="demand" dpr={[1, 1.5]}
      camera={{
        fov: (ALL_CAMERA_PRESETS[view] ?? SPIKE_CAMERA_PRESETS.overview).fov ?? 38,
        near: 0.05,
        far: 10,
        position: (ALL_CAMERA_PRESETS[view] ?? SPIKE_CAMERA_PRESETS.overview).position,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        contextRef.current = gl.getContext();
        const canvas = gl.domElement;
        const lost = (event: Event) => { event.preventDefault(); fail("WebGL context lost"); };
        const restored = () => retry();
        canvas.addEventListener("webglcontextlost", lost);
        canvas.addEventListener("webglcontextrestored", restored);
        cleanupRef.current = () => {
          canvas.removeEventListener("webglcontextlost", lost);
          canvas.removeEventListener("webglcontextrestored", restored);
          contextRef.current = null;
        };
      }}>
      <RoomLighting />
      <CameraRig view={view} />
      <SceneBoundary onError={fail}><Suspense fallback={null}>
        <SpikeModel
          url={url}
          primaryHex={primaryHex}
          secondaryHex={secondaryHex}
          threadHex={threadHex}
          trimHex={trimHex}
          steeringHex={steeringHex}
          accentHex={accentHex}
          cockpitBlackHex={cockpitBlackHex}
          onLoaded={loaded}
          onStats={stats}
        />
      </Suspense></SceneBoundary>
    </Canvas>}
    {status !== "success" && <div className="absolute inset-x-3 bottom-14 z-10 rounded-lg bg-[#141416]/90 px-3 py-2 text-xs text-slate-200"
      role="status" aria-live="polite" data-testid="viewer-status">
      {status === "loading" ? "Loading 2020 Lexus RX 350 interior assembly…" : status === "empty" ? "3D model contains no geometry. Showing studio preview." : "3D preview unavailable (" + (error ?? "unknown error") + "). Showing studio preview."}
      {status !== "loading" && <button type="button" onClick={retry} className="ml-3 underline underline-offset-2">Retry 3D</button>}
    </div>}
  </div>;
}
