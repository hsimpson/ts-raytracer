// export class WebGPUContext {
//   private _device: GPUDevice;
//   private _queue: GPUQueue;

//   public constructor(device: GPUDevice, queue: GPUQueue) {
//     this._device = device;
//     this._queue = queue;
//   }

//   public get device(): GPUDevice {
//     return this._device;
//   }

//   public get queue(): GPUQueue {
//     return this._queue;
//   }
// }

export class WebGPUContext {
  private static _device: GPUDevice;
  private static _queue: GPUQueue;

  public static createContext(device: GPUDevice, queue: GPUQueue): void {
    WebGPUContext._device = device;
    WebGPUContext._queue = queue;
  }

  public static get device(): GPUDevice {
    return WebGPUContext._device;
  }

  public static get queue(): GPUQueue {
    return WebGPUContext._queue;
  }
}
