import { describe, expect, it } from "vitest";
import { MeshStandardMaterial, Texture, type WebGLRenderer } from "three";
import { attachThreadMask } from "../src/lib/three/thread-mask";

function shaderPayload() {
  return {
    fragmentShader: "#include <map_fragment>",
    vertexShader: "",
    uniforms: {} as Record<string, { value: unknown }>,
  };
}

describe("cached Diamond material lifecycle", () => {
  it("restores an existing shader extension across repeated treatment and StrictMode cleanup cycles", () => {
    const primary = new MeshStandardMaterial({
      map: new Texture(), normalMap: new Texture(), roughnessMap: new Texture(),
    });
    const thread = new MeshStandardMaterial({ color: "#d4af37" });
    const maps = [primary.map, primary.normalMap, primary.roughnessMap];
    primary.name = "MAT_Seat_Primary";
    const priorHook: typeof primary.onBeforeCompile = function (this: MeshStandardMaterial, shader) {
      shader.uniforms.existingMaterial = { value: this };
    };
    const priorKey = function (this: MeshStandardMaterial) { return `${this.name}:existing`; };
    primary.onBeforeCompile = priorHook;
    primary.customProgramCacheKey = priorKey;
    let diamondKey: string | undefined;

    for (const color of ["#ff0000", "#00ff00", "#0000ff", "#ff0000"]) {
      const versionBefore = primary.version;
      const restore = attachThreadMask(primary, thread);
      const activeKey = primary.customProgramCacheKey();
      diamondKey ??= activeKey;
      expect(activeKey).toBe(diamondKey);
      expect(activeKey).not.toBe(priorKey.call(primary));
      const shader = shaderPayload();
      primary.onBeforeCompile(shader as Parameters<typeof primary.onBeforeCompile>[0], {} as WebGLRenderer);
      expect(shader.uniforms.existingMaterial.value).toBe(primary);
      expect(shader.uniforms.l4ThreadColor.value).toBe(thread.color);
      thread.color.set(color);
      expect(shader.uniforms.l4ThreadColor.value).toBe(thread.color);
      expect(thread.color.getHexString()).toBe(color.slice(1));
      expect([primary.map, primary.normalMap, primary.roughnessMap]).toEqual(maps);

      restore();
      expect(primary.onBeforeCompile).toBe(priorHook);
      expect(primary.customProgramCacheKey).toBe(priorKey);
      expect(primary.customProgramCacheKey()).toBe("MAT_Seat_Primary:existing");
      expect(primary.version).toBeGreaterThan(versionBefore);
      const restoredShader = shaderPayload();
      primary.onBeforeCompile(restoredShader as Parameters<typeof primary.onBeforeCompile>[0], {} as WebGLRenderer);
      expect(restoredShader.uniforms.existingMaterial.value).toBe(primary);
      expect(restoredShader.uniforms.l4ThreadColor).toBeUndefined();
    }

    maps.forEach(texture => texture?.dispose());
    primary.dispose();
    thread.dispose();
  });
});
