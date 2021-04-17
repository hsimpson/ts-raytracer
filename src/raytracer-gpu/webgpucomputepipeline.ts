import { Camera } from '../camera';
import { HittableList } from '../hittables';
import { vec3 } from 'gl-matrix';
import { RaytracingBuffers } from './raytracingbuffers';
import { WebGPUBuffer } from './webgpubuffer';
import { WebGPUContext } from './webgpucontext';
import { WebGPUPipelineBase } from './webgpupipelinebase';
import { ComputeTile } from '../tiles';

interface ComputeUniformParams {
  background: vec3;
  tileOffsetX: number;
  tileOffsetY: number;
  imageWidth: number;
  imageHeight: number;
  currentSample: number;
  maxBounces: number;
  padding_0: number;
  padding_1: number;
  padding_2: number;
}

interface WebGPUComputePiplineOptions {
  computeShaderUrl: string;
  uniformParams: ComputeUniformParams;
  camera: Camera;
  world: HittableList;
}

const enum Bindings {
  ComputeParams = 0,
  Camera = 1,
  PixelBuffer = 2,
  AccumulationBuffer = 3,

  Primitives = 4,
  Materials = 5,
  Textures = 6,

  Sampler = 7,
  ImageTexture = 8,
}

export class WebGPUComputePipline extends WebGPUPipelineBase {
  private _options: WebGPUComputePiplineOptions;
  private _raytracingBuffers: RaytracingBuffers;

  private _computeParamsUniformBuffer = new WebGPUBuffer();
  private _computeCameraUniformBuffer = new WebGPUBuffer();
  private _pixelBuffer = new WebGPUBuffer();
  private _accumulationBuffer = new WebGPUBuffer();

  private _primitivesBuffer = new WebGPUBuffer();
  private _materialsBuffer = new WebGPUBuffer();
  private _texturesBuffer = new WebGPUBuffer();

  public constructor(options: WebGPUComputePiplineOptions) {
    super();
    this._options = options;
    // this._options.uniformParams.randomSeed = Math.random();
    this._options.uniformParams.currentSample = 0;

    this._raytracingBuffers = new RaytracingBuffers(this._options.world);
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    const pixelBufferSize =
      this._options.uniformParams.imageWidth *
      this._options.uniformParams.imageHeight *
      4 *
      Float32Array.BYTES_PER_ELEMENT;

    //COPY_SRC is needed because the pixel buffer is read after each compute call
    this._pixelBuffer.create(pixelBufferSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    this._accumulationBuffer.create(pixelBufferSize, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);

    const uniformArray = this.getParamsArray(this._options.uniformParams);
    //COPY_DST is needed because the uniforms are updated after each compute call
    this._computeParamsUniformBuffer.createWithArrayMapped(
      uniformArray,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    );

    const cameraArray = this._options.camera.getUniformArray();
    this._computeCameraUniformBuffer.createWithArrayMapped(cameraArray, GPUBufferUsage.UNIFORM);

    this.createObjects();

    const bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
      entries: [
        {
          binding: Bindings.ComputeParams,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: Bindings.Camera,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: Bindings.PixelBuffer,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
        {
          binding: Bindings.AccumulationBuffer,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
        {
          binding: Bindings.Primitives,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
        {
          binding: Bindings.Materials,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
        {
          binding: Bindings.Textures,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
      ],
    };

    // if (this._raytracingBuffers.hasImageTextures) {
    bindGroupLayoutDescriptor.entries = [
      ...bindGroupLayoutDescriptor.entries,
      {
        binding: Bindings.Sampler,
        visibility: GPUShaderStage.COMPUTE,
        sampler: {
          type: 'filtering',
        },
      },
      {
        binding: Bindings.ImageTexture,
        visibility: GPUShaderStage.COMPUTE,
        texture: {
          sampleType: 'float',
        },
      },
    ];
    // }

    this._bindGroupLayout = WebGPUContext.device.createBindGroupLayout(bindGroupLayoutDescriptor);

    await this.createBindGroup();
  }

  public createObjects(): void {
    this._primitivesBuffer.createWithArrayMapped(this._raytracingBuffers.primitiveBuffer(), GPUBufferUsage.STORAGE);
    this._materialsBuffer.createWithArrayMapped(this._raytracingBuffers.materialBuffer(), GPUBufferUsage.STORAGE);
    this._texturesBuffer.createWithArrayMapped(this._raytracingBuffers.textureBuffer(), GPUBufferUsage.STORAGE);
  }

  public updateUniformBuffer(sample: number, tile: ComputeTile): void {
    if (this._initialized) {
      this._options.uniformParams.currentSample = sample;
      this._options.uniformParams.tileOffsetX = tile.x;
      this._options.uniformParams.tileOffsetY = tile.y;
      const uniformArray = this.getParamsArray(this._options.uniformParams);
      WebGPUContext.queue.writeBuffer(this._computeParamsUniformBuffer.gpuBuffer, 0, uniformArray.buffer);
    }
  }

  protected async createBindGroup(): Promise<void> {
    const bindGroupDescriptor: GPUBindGroupDescriptor = {
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
          binding: Bindings.AccumulationBuffer,
          resource: {
            buffer: this._accumulationBuffer.gpuBuffer,
            offset: 0,
            size: this._accumulationBuffer.size,
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
        {
          binding: Bindings.Textures,
          resource: {
            buffer: this._texturesBuffer.gpuBuffer,
            offset: 0,
            size: this._texturesBuffer.size,
          },
        },
      ],
    };

    // if (this._raytracingBuffers.hasImageTextures) {
    const { sampler, textureView } = await this._raytracingBuffers.imageTexture();

    bindGroupDescriptor.entries = [
      ...bindGroupDescriptor.entries,
      {
        binding: Bindings.Sampler,
        resource: sampler,
      },
      {
        binding: Bindings.ImageTexture,
        resource: textureView,
      },
    ];
    // }

    this._bindGroup = WebGPUContext.device.createBindGroup(bindGroupDescriptor);

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = WebGPUContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout],
    });

    const computeStage: GPUProgrammableStage = {
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
