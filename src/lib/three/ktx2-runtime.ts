import type { WebGLRenderer } from "three";
import { KTX2Loader } from "three-stdlib";

// init() exists in the installed stdlib runtime but is absent from its declaration.
type InitializableLoader = KTX2Loader & { init(): Promise<unknown> };

/** Owns decoder workers for one renderer, outside the model's Suspense boundary. */
export function createKtx2Runtime(
  renderer: WebGLRenderer,
  clearURL: (url: string) => void,
  createLoader: () => KTX2Loader = () => new KTX2Loader(),
) {
  const loader = createLoader() as InitializableLoader;
  loader.setTranscoderPath("/basis/").setWorkerLimit(2).detectSupport(renderer);
  const originalLoad = loader.load.bind(loader);
  const originalInit = loader.init.bind(loader);
  const urls = new Set<string>();
  let owners = 0;
  let outstanding = 0;
  let initialized = false;
  let retired = false;
  let disposed = false;
  let retirement: ReturnType<typeof setTimeout> | undefined;

  const disposeWhenIdle = () => {
    // stdlib increments its global active count only in init(). Disposing before
    // init would incorrectly decrement it. Never terminate an active decode:
    // WorkerPool.dispose() does not settle the outstanding load callbacks.
    if (retired && outstanding === 0 && initialized && !disposed) {
      disposed = true;
      loader.dispose();
    }
  };
  loader.init = () => {
    initialized = true;
    return originalInit();
  };
  loader.load = (...args: Parameters<KTX2Loader["load"]>) => {
    const [url, onLoad, onProgress, onError] = args;
    if (retired) {
      const error = new Error("KTX2 renderer runtime has retired");
      if (onError) onError(error);
      else throw error;
      // Installed stdlib load() returns undefined; its inherited declaration
      // incorrectly promises a CompressedTexture. Callers use callbacks.
      return undefined as unknown as ReturnType<KTX2Loader["load"]>;
    }
    outstanding++;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      outstanding--;
      disposeWhenIdle();
    };
    try {
      return originalLoad(url, texture => {
        if (settled) return;
        try { onLoad?.(texture); } finally { finish(); }
      }, onProgress, error => {
        if (settled) return;
        try { onError?.(error); } finally { finish(); }
      });
    } catch (error) {
      finish();
      if (onError) onError(error);
      else throw error;
      return undefined as unknown as ReturnType<KTX2Loader["load"]>;
    }
  };

  return {
    loader: loader as KTX2Loader,
    acquire() {
      if (retired) throw new Error("KTX2 renderer runtime has retired");
      owners++;
      if (retirement !== undefined) clearTimeout(retirement);
      retirement = undefined;
    },
    release() {
      if (owners === 0) return;
      owners--;
      if (owners > 0) return;
      // Immediate effect reacquisition cancels StrictMode/HMR replay teardown.
      retirement = setTimeout(() => {
        retirement = undefined;
        retired = true;
        try { urls.forEach(url => clearURL(url)); } finally { urls.clear(); disposeWhenIdle(); }
      }, 0);
    },
    trackURL(url: string) {
      if (retired) throw new Error("KTX2 renderer runtime has retired");
      urls.add(url);
    },
  };
}
