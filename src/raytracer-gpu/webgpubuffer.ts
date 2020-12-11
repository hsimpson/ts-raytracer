import { WebGPUContext } from './webgpucontext';

export class WebGPUBuffer {
  private _gpuBuffer: GPUBuffer;
  private _size = 0;

  public create(size: number, usage: GPUBufferUsageFlags): void {
    this._size = size;

    this._gpuBuffer = WebGPUContext.device.createBuffer({
      size: this._size,
      usage,
    });
  }

  public createWithArrayMapped(srcArrayBuffer: ArrayBuffer, usage: GPUBufferUsageFlags): void {
    this._size = srcArrayBuffer.byteLength;
    // console.log(`createWithArrayMapped from ${array.constructor.name}`);

    let bufferMapped: ArrayBuffer;

    // console.log(`createWithArrayMapped from ${array.constructor.name}`);

    // newer spec
    if (GPUBuffer.prototype.getMappedRange) {
      this._gpuBuffer = WebGPUContext.device.createBuffer({
        mappedAtCreation: true,
        size: this._size,
        usage,
      });
      bufferMapped = this._gpuBuffer.getMappedRange();
    } else {
      // FIXME: remove when all browsers support this
      [this._gpuBuffer, bufferMapped] = WebGPUContext.device['createBufferMapped']({
        size: this._size,
        usage,
      });
    }

    // new Uint8Array(bufferMapped).set(new Uint8Array(srcArrayBuffer)); // memcpy
    new Float32Array(bufferMapped).set(new Float32Array(srcArrayBuffer)); // memcpy

    this._gpuBuffer.unmap();
  }

  public async mapRead(offset?: number, size?: number): Promise<ArrayBuffer> {
    await this._gpuBuffer.mapAsync(GPUMapMode.READ);
    return this._gpuBuffer.getMappedRange(offset, size);
  }

  public async mapWrite(offset?: number, size?: number): Promise<ArrayBuffer> {
    await this._gpuBuffer.mapAsync(GPUMapMode.WRITE);
    return this._gpuBuffer.getMappedRange(offset, size);
  }

  public get gpuBuffer(): GPUBuffer {
    return this._gpuBuffer;
  }

  public get size(): number {
    return this._size;
  }
}
