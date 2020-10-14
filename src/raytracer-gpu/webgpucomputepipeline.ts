import Camera from '../camera';
import { HittableList } from '../raytracer-cpu/hittablelist';
import { RaytracingBuffers } from './raytracingbuffers';
import { WebGPUBuffer } from './webgpubuffer';
import { WebGPUContext } from './webgpucontext';
import WebGPUPipelineBase from './webgpupipelinebase';

interface ComputeUniformParams {
  fWidth: number;
  fHeight: number;
  fSamplesPerPixel: number;
  fMaxBounces: number;
  fRandomSeed?: number;
}

interface WebGPUComputePiplineOptions {
  computeShaderUrl: string;
  uniformParams: ComputeUniformParams;
  // randomScene: Float32Array;
  camera: Camera;
  world: HittableList;
}

const enum Bindings {
  ComputeParams = 0,
  Camera = 1,
  PixelBuffer = 2,

  Primitives = 3,
  Materials = 4,
}

export default class WebGPUComputePipline extends WebGPUPipelineBase {
  private _options: WebGPUComputePiplineOptions;
  private _raytracingBuffers: RaytracingBuffers;

  private _computeParamsUniformBuffer = new WebGPUBuffer();
  private _computeCameraUniformBuffer = new WebGPUBuffer();
  private _pixelBuffer = new WebGPUBuffer();

  private _primitivesBuffer = new WebGPUBuffer();
  private _materialsBuffer = new WebGPUBuffer();

  public constructor(options: WebGPUComputePiplineOptions) {
    super();
    this._options = options;
    this._options.uniformParams.fRandomSeed = Math.random();

    this._raytracingBuffers = new RaytracingBuffers(this._options.world);
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    const pixelArray = new Float32Array(this._options.uniformParams.fWidth * this._options.uniformParams.fHeight * 4);
    this._pixelBuffer.createWithArrayMapped(pixelArray, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);

    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._computeParamsUniformBuffer.createWithArrayMapped(
      uniformArray,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    );

    const cameraArray = this._options.camera.getUniformArray();
    this._computeCameraUniformBuffer.createWithArrayMapped(
      cameraArray,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    );

    this.createObjects();

    this._bindGroupLayout = WebGPUContext.device.createBindGroupLayout({
      entries: [
        {
          binding: Bindings.ComputeParams,
          visibility: GPUShaderStage.COMPUTE,
          type: 'uniform-buffer',
        },
        {
          binding: Bindings.Camera,
          visibility: GPUShaderStage.COMPUTE,
          type: 'uniform-buffer',
        },
        {
          binding: Bindings.PixelBuffer,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        {
          binding: Bindings.Primitives,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        {
          binding: Bindings.Materials,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
      ],
    });

    await this.createBindGroup();
  }

  public createObjects(): void {
    this._primitivesBuffer.createWithArrayMapped(this._raytracingBuffers.primitiveBuffer(), GPUBufferUsage.STORAGE);
    this._materialsBuffer.createWithArrayMapped(this._raytracingBuffers.materialBuffer(), GPUBufferUsage.STORAGE);
  }

  public updateUniformBuffer(): void {
    if (this._initialized) {
      this._options.uniformParams.fRandomSeed = Math.random();
      const uniformArray = this.getParamsArray(this._options.uniformParams);
      WebGPUContext.queue.writeBuffer(this._computeParamsUniformBuffer.gpuBuffer, 0, uniformArray.buffer);
    }
  }

  protected async createBindGroup(): Promise<void> {
    this._bindGroup = WebGPUContext.device.createBindGroup({
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: Bindings.ComputeParams,
          resource: {
            buffer: this._computeParamsUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._computeParamsUniformBuffer.size,
          },
        },
        {
          binding: Bindings.Camera,
          resource: {
            buffer: this._computeCameraUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._computeCameraUniformBuffer.size,
          },
        },
        {
          binding: Bindings.PixelBuffer,
          resource: {
            buffer: this._pixelBuffer.gpuBuffer,
            offset: 0,
            size: this._pixelBuffer.size,
          },
        },
        {
          binding: Bindings.Primitives,
          resource: {
            buffer: this._primitivesBuffer.gpuBuffer,
            offset: 0,
            size: this._primitivesBuffer.size,
          },
        },
        {
          binding: Bindings.Materials,
          resource: {
            buffer: this._materialsBuffer.gpuBuffer,
            offset: 0,
            size: this._materialsBuffer.size,
          },
        },
      ],
    });

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = WebGPUContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout],
    });

    const computeStage: GPUProgrammableStageDescriptor = {
      module: await this.loadShader(this._options.computeShaderUrl),
      entryPoint: 'main',
    };

    const pipelineDesc: GPUComputePipelineDescriptor = {
      layout,
      computeStage,
    };

    this._pipeline = WebGPUContext.device.createComputePipeline(pipelineDesc);
  }

  public get gpuPipeline(): GPUComputePipeline {
    return this._pipeline as GPUComputePipeline;
  }

  public get pixelBuffer(): WebGPUBuffer {
    return this._pixelBuffer;
  }
}
