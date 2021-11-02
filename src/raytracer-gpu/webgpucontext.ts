export class WebGPUContext {
  private static _device: GPUDevice;
  private static _queue: GPUQueue;
  private static _context: GPUCanvasContext;

  public static createContext(device: GPUDevice, queue: GPUQueue, context: GPUCanvasContext): void {
    WebGPUContext._device = device;
    WebGPUContext._queue = queue;
    WebGPUContext._context = context;
  }

  public static get device(): GPUDevice {
    return WebGPUContext._device;
  }

  public static get queue(): GPUQueue {
    return WebGPUContext._queue;
  }

  public static get context(): GPUCanvasContext {
    return WebGPUContext._context;
  }
}
