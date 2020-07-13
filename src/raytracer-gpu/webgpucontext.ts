export default class WebGPUContext {
  private _device: GPUDevice;
  private _queue: GPUQueue;

  public constructor(device: GPUDevice, queue: GPUQueue) {
    this._device = device;
    this._queue = queue;
  }

  public get device(): GPUDevice {
    return this._device;
  }

  public get queue(): GPUQueue {
    return this._queue;
  }
}
