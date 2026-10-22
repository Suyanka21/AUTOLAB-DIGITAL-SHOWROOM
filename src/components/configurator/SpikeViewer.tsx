"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial, PMREMGenerator, type Texture } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SPIKE_CAMERA_PRESETS, type CameraViewId } from "@/config/spike-camera-presets";
import { LEXUS_CAMERA_PRESETS } from "@/config/lexus-camera-presets";

const ALL_CAMERA_PRESETS: Record<string, { target: readonly [number, number, number]; position: readonly [number, number, number] }> = {
  ...SPIKE_CAMERA_PRESETS,
  ...LEXUS_CAMERA_PRESETS,
};

// Sources: https://r3f.docs.pmnd.rs/api/canvas,
// https://drei.docs.pmnd.rs/loaders/gltf-use-gltf,
// https://threejs.org/docs/pages/RoomEnvironment.html,
// https://threejs.org/docs/pages/GLTFLoader.html.
const ASSET_URL = "/assets/3d/s-class-v223/spike.glb";
const SEAT_NODE = "GEO_Seat_Front_Driver_Flutes";
const OLED_NODE = "GEO_Dashboard_Screen_Central_OLED";
const SEAT_SLOT = "MAT_Upholstery_Primary";
const OLED_SLOT = "MAT_Screen_Central_OLED";
type ViewerStatus = "loading" | "success" | "empty" | "error";
export type RendererStats = { calls: number; triangles: number; textures: number; geometries: number };
type MaterialState = { bindings: Record<string, string>; colors: Record<string, string> };
export type ViewerEvidence = { status: ViewerStatus; assetUrl: string; materialState: MaterialState | null; renderer: RendererStats | null; error: string | null };

declare global {
  interface Window {
    __autolab?: { snapshot: () => ViewerEvidence; loseContext: () => boolean };
  }
}

function testParam(key: string) {
  return process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has(key);
}
function getAssetUrl() { return testParam("missing-spike") ? "/assets/3d/s-class-v223/missing-spike.glb" : ASSET_URL; }

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
    camera.position.set(preset.position[0], preset.position[1], preset.position[2]);
    controls.current?.target.set(preset.target[0], preset.target[1], preset.target[2]);
    controls.current?.update();
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, view]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reducedMotion}
    minDistance={0.35} maxDistance={4} minPolarAngle={0.15} maxPolarAngle={Math.PI * 0.82} />;
}

function modelMaterials(scene: Group) {
  const meshes: Mesh[] = [];
  scene.traverse((object) => { if (object instanceof Mesh) meshes.push(object); });
  if (meshes.length === 0) return null;
  if (meshes.length !== 2) throw new Error("Expected two spike meshes; found " + meshes.length);
  const seat = meshes.find((mesh) => mesh.name === SEAT_NODE);
  const oled = meshes.find((mesh) => mesh.name === OLED_NODE);
  if (!seat || !oled || !(seat.material instanceof MeshStandardMaterial) || !(oled.material instanceof MeshStandardMaterial)) {
    throw new Error("Spike mesh or material contract is missing");
  }
  if (seat.material.name !== SEAT_SLOT || oled.material.name !== OLED_SLOT) throw new Error("Spike material binding mismatch");
  return { seat: seat.material, oled: oled.material };
}

function SpikeModel({ url, primaryHex, onLoaded, onStats }: {
  url: string; primaryHex: string; onLoaded: (state: MaterialState | null) => void; onStats: (stats: RendererStats) => void;
}) {
  // A local decoder path avoids Drei's default external decoder CDN.
  const { scene } = useGLTF(url, "/draco/") as { scene: Group };
  const { gl, invalidate } = useThree();
  const materials = useMemo(() => modelMaterials(scene), [scene]);
  useEffect(() => {
    if (!materials) { onLoaded(null); return; }
    onLoaded({
      bindings: { [SEAT_NODE]: materials.seat.name, [OLED_NODE]: materials.oled.name },
      colors: { [SEAT_SLOT]: "#" + materials.seat.color.getHexString(), [OLED_SLOT]: "#" + materials.oled.color.getHexString() },
    });
  }, [materials, onLoaded]);
  useEffect(() => {
    if (!materials) return;
    // Test-only fault injection proves the swatch assertion catches a broken binding.
    if (!testParam("break-seat-binding")) materials.seat.color.set(primaryHex);
    invalidate();
    const timer = window.setTimeout(() => {
      onLoaded({
        bindings: { [SEAT_NODE]: materials.seat.name, [OLED_NODE]: materials.oled.name },
        colors: { [SEAT_SLOT]: "#" + materials.seat.color.getHexString(), [OLED_SLOT]: "#" + materials.oled.color.getHexString() },
      });
      onStats({ calls: gl.info.render.calls, triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures, geometries: gl.info.memory.geometries });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [materials, primaryHex, invalidate, onLoaded, onStats, gl]);
  return <primitive object={scene} />;
}

class SceneBoundary extends React.Component<{ children: React.ReactNode; onError: (message: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function SpikeViewer({ view, primaryHex, onStatus, onStats }: {
  view: CameraViewId; primaryHex: string; onStatus: (status: ViewerStatus) => void; onStats: (stats: RendererStats | null) => void;
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
    window.__autolab = {
      snapshot: () => ({ status, assetUrl: url, materialState, renderer, error }),
      loseContext: () => {
        const extension = contextRef.current?.getExtension("WEBGL_lose_context");
        if (!extension) return false;
        extension.loseContext();
        return true;
      },
    };
    return () => { delete window.__autolab; };
  }, [status, url, materialState, renderer, error]);

  const retry = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setError(null); setMaterialState(null); setRenderer(null);
    setStatus("loading"); onStatus("loading"); onStats(null);
    setRetryKey((value) => value + 1);
  };
  return <div className="absolute inset-0 z-10" style={{ backgroundColor: status === "success" ? "#0F1014" : "transparent" }}
    data-testid="spike-viewer" aria-label="Provisional two-node 3D viewer">
    {supported && status !== "error" && status !== "empty" && <Canvas key={retryKey} frameloop="demand" dpr={[1, 1.5]}
      camera={{ fov: 38, near: 0.05, far: 10, position: (ALL_CAMERA_PRESETS[view] ?? SPIKE_CAMERA_PRESETS.overview).position }}
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
        <SpikeModel url={url} primaryHex={primaryHex} onLoaded={loaded} onStats={stats} />
      </Suspense></SceneBoundary>
    </Canvas>}
    {status !== "success" && <div className="absolute inset-x-3 bottom-14 z-10 rounded-lg bg-[#141416]/90 px-3 py-2 text-xs text-slate-200"
      role="status" aria-live="polite" data-testid="viewer-status">
      {status === "loading" ? "Loading provisional 3D spike…" : status === "empty" ? "3D spike contains no meshes. Showing the 2D preview." : "3D preview unavailable (" + (error ?? "unknown error") + "). Showing the 2D preview."}
      {status !== "loading" && <button type="button" onClick={retry} className="ml-3 underline underline-offset-2">Retry 3D</button>}
    </div>}
  </div>;
}
