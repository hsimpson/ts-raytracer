import { WebGPUContext } from './webgpucontext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TypedArray = ArrayLike<any> & {
  // BYTES_PER_ELEMENT: number;
  byteLength: number;
  set(array: ArrayLike<number>, offset?: number): void;
};

type TypedArrayConstructor<T> = {
  // new (): T;
  // new (size: number): T;
  new (buffer: ArrayBuffer): T;
  // BYTES_PER_ELEMENT: number;
};

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

  public createWithArrayMapped<T extends TypedArray>(array: T, usage: GPUBufferUsageFlags): void {
    this._size = array.byteLength;
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

    // const writeArray = new T(bufferMapped);
    const writeArray = new (array.constructor as TypedArrayConstructor<T>)(bufferMapped);
    writeArray.set(array);
    this._gpuBuffer.unmap();
  }

  public async mapRead(offset?: number, size?: number): Promise<ArrayBuffer> {
    // newer spec
    if (GPUBuffer.prototype.mapAsync) {
      await this._gpuBuffer.mapAsync(GPUMapMode.READ);
      return this._gpuBuffer.getMappedRange(offset, size);
    } else {
      // FIXME: remove when all browsers support this
      return this._gpuBuffer['mapReadAsync']();
    }
  }

  public async mapWrite(offset?: number, size?: number): Promise<ArrayBuffer> {
    // newer spec
    if (GPUBuffer.prototype.mapAsync) {
      await this._gpuBuffer.mapAsync(GPUMapMode.WRITE);
      return this._gpuBuffer.getMappedRange(offset, size);
    } else {
      // FIXME: remove when all browsers support this
      return this._gpuBuffer['mapWriteAsync']();
    }
  }

  public get gpuBuffer(): GPUBuffer {
    return this._gpuBuffer;
  }

  public get size(): number {
    return this._size;
  }
}
