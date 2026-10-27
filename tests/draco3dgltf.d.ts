// This package exposes a generated WASM module without TypeScript declarations.
// Keep it opaque: tests pass it directly to NodeIO and never access its internals.
declare module "draco3dgltf" {
  const draco3d: {
    createDecoderModule(options?: Record<string, unknown>): Promise<unknown>;
  };
  export default draco3d;
}
