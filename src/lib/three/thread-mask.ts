import type { MeshStandardMaterial, WebGLRenderer } from "three";

export type RestoreShaderHook = () => void;

interface WebGLShaderPayload {
  fragmentShader: string;
  vertexShader: string;
  uniforms: Record<string, { value: unknown }>;
}

/**
 * Attaches the L4A quilt-thread mask hook to the primary seat material.
 * Reads the alpha channel of the primary ORM roughnessMap and mixes in the
 * existing thread slot's Color object without adding geometry or material slots.
 */
export function attachThreadMask(
  primary: MeshStandardMaterial | undefined | null,
  thread: MeshStandardMaterial | undefined | null,
): RestoreShaderHook {
  if (!primary?.roughnessMap || !thread?.color) {
    throw new Error("Thread mask requires primary ORM roughnessMap and the existing thread slot");
  }

  const previous = primary.onBeforeCompile;
  const previousKeyRaw = primary.customProgramCacheKey;
  const previousKey = primary.customProgramCacheKey ? primary.customProgramCacheKey.bind(primary) : () => "";

  primary.onBeforeCompile = function (shader: WebGLShaderPayload, renderer: WebGLRenderer) {
    previous.call(this, shader as unknown as Parameters<typeof previous>[0], renderer);
    const marker = "#include <map_fragment>";
    if (!shader.fragmentShader.includes(marker)) {
      throw new Error("Unsupported Three shader: map_fragment missing");
    }
    shader.uniforms.l4ThreadColor = { value: thread.color };
    shader.fragmentShader =
      "uniform vec3 l4ThreadColor;\n" +
      shader.fragmentShader.replace(
        marker,
        marker + `
    #ifdef USE_ROUGHNESSMAP
      float l4Thread = texture2D( roughnessMap, vRoughnessMapUv ).a;
      diffuseColor.rgb = mix( diffuseColor.rgb, l4ThreadColor * 0.85, l4Thread );
    #endif
  `,
      );
  };

  primary.customProgramCacheKey = () => previousKey() + "|autolab-l4a-thread-v1";
  primary.needsUpdate = true;

  return () => {
    primary.onBeforeCompile = previous;
    primary.customProgramCacheKey = previousKeyRaw;
    primary.needsUpdate = true;
  };
}
