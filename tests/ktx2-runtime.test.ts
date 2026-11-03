import { afterEach, describe, expect, it, vi } from "vitest";
import { CompressedTexture, type WebGLRenderer } from "three";
import { KTX2Loader } from "three-stdlib";
import { createKtx2Runtime } from "../src/lib/three/ktx2-runtime";

const renderer = {
  extensions: { has: () => false }, capabilities: { isWebGL2: true },
} as unknown as WebGLRenderer;

// Real loader configuration, controlled I/O boundary: no worker/network in unit tests.
class ControlledLoader extends KTX2Loader {
  initialized = false;
  disposed = 0;
  pending: Array<{ resolve: () => void; reject: () => void }> = [];
  init() { this.initialized = true; return Promise.resolve(); }
  override dispose() { this.disposed++; return this; }
  override load(...args: Parameters<KTX2Loader["load"]>): CompressedTexture {
    const [, onLoad, , onError] = args;
    const config = (this as unknown as { workerConfig: unknown }).workerConfig;
    if (!config) throw new Error("Missing initialization with detectSupport(renderer)");
    void this.init();
    const texture = new CompressedTexture([], 1, 1);
    this.pending.push({ resolve: () => onLoad?.(texture), reject: () => onError?.(new Error("decode failed")) });
    return texture;
  }
}

function setup() {
  vi.useFakeTimers();
  const loader = new ControlledLoader();
  const clearURL = vi.fn();
  const runtime = createKtx2Runtime(renderer, clearURL, () => loader);
  return { runtime, loader, clearURL };
}

afterEach(() => vi.useRealTimers());

describe("renderer-owned KTX2 lifecycle", () => {
  it("configures local decoding before the first load, even before the owner effect commits", () => {
    const { runtime, loader } = setup();
    expect(runtime.loader).toBe(loader);
    expect((loader as unknown as { transcoderPath: string }).transcoderPath).toBe("/basis/");
    expect((loader as unknown as { workerPool: { pool: number } }).workerPool.pool).toBe(2);
    const loaded = vi.fn();
    runtime.loader.load("blob:early", loaded);
    expect(loader.initialized).toBe(true);
    loader.pending[0].resolve();
    expect(loaded).toHaveBeenCalledOnce();
    runtime.acquire(); runtime.release(); vi.runAllTimers();
    expect(loader.disposed).toBe(1);
  });

  it("reuses one instance across URLs and cancels StrictMode replay retirement", () => {
    const { runtime, loader, clearURL } = setup();
    runtime.acquire(); runtime.trackURL("classic.glb"); runtime.release();
    runtime.acquire(); runtime.trackURL("diamond.glb");
    vi.runAllTimers();
    expect(loader.disposed).toBe(0);
    expect(clearURL).not.toHaveBeenCalled();
    expect(runtime.loader).toBe(loader);
    runtime.loader.load("blob:diamond", vi.fn()); loader.pending[0].resolve();
    runtime.release(); vi.runAllTimers();
    expect(clearURL.mock.calls.map(call => call[0])).toEqual(["classic.glb", "diamond.glb"]);
    expect(loader.disposed).toBe(1);
  });

  it("retires cache entries once but waits for outstanding texture callbacks before disposal", () => {
    const { runtime, loader, clearURL } = setup();
    runtime.acquire(); runtime.trackURL("classic.glb"); runtime.trackURL("classic.glb");
    runtime.loader.load("blob:base", vi.fn()); runtime.loader.load("blob:normal", vi.fn(), undefined, vi.fn());
    runtime.release(); vi.runAllTimers();
    expect(clearURL).toHaveBeenCalledExactlyOnceWith("classic.glb");
    expect(loader.disposed).toBe(0);
    loader.pending[0].resolve(); expect(loader.disposed).toBe(0);
    loader.pending[1].reject(); expect(loader.disposed).toBe(1);
    loader.pending[1].reject(); expect(loader.disposed).toBe(1);
  });

  it("rejects late parsing without creating more work after retirement", () => {
    const { runtime, loader } = setup();
    runtime.acquire(); runtime.release(); vi.runAllTimers();
    const error = vi.fn();
    runtime.loader.load("blob:late", vi.fn(), undefined, error);
    expect(error).toHaveBeenCalledOnce();
    expect(String(error.mock.calls[0][0])).toMatch(/retired/);
    expect(loader.pending).toHaveLength(0);
    expect(loader.initialized).toBe(false);
    expect(() => runtime.acquire()).toThrow(/retired/);
    expect(() => runtime.trackURL("late.glb")).toThrow(/retired/);
  });

  it("does not decrement stdlib's active-loader count when initialization never ran", () => {
    const { runtime, loader } = setup();
    runtime.acquire(); runtime.release(); runtime.release(); vi.runAllTimers();
    expect(loader.disposed).toBe(0);
  });

  it("keeps a shared owner alive until all acquisitions release", () => {
    const { runtime, loader, clearURL } = setup();
    runtime.acquire(); runtime.acquire(); runtime.trackURL("classic.glb");
    runtime.loader.load("blob:base", vi.fn()); loader.pending[0].resolve();
    runtime.release(); vi.runAllTimers();
    expect(clearURL).not.toHaveBeenCalled();
    runtime.release(); runtime.release(); vi.runAllTimers();
    expect(loader.disposed).toBe(1);
    expect(clearURL).toHaveBeenCalledOnce();
  });
});
