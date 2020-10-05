import { WebGPUContext } from './webgpucontext';

export class WebGPUBuffer {
  private _gpuBuffer: GPUBuffer;
  private _size = 0;

  public create(arr: Float32Array | Uint16Array, usage: GPUBufferUsageFlags): void {
    this._size = arr.byteLength;

    this._gpuBuffer = WebGPUContext.device.createBuffer({
      mappedAtCreation: true,
      size: this._size,
      usage,
    });

    const bufferMapped = this._gpuBuffer.getMappedRange();

    const writeArray = arr instanceof Float32Array ? new Float32Array(bufferMapped) : new Uint16Array(bufferMapped);
    writeArray.set(arr);
    this._gpuBuffer.unmap();
  }

  public get gpuBuffer(): GPUBuffer {
    return this._gpuBuffer;
  }

  public get size(): number {
    return this._size;
  }
}
