import Camera from '../camera';
import { HittableList } from '../raytracer-cpu/hittablelist';
import LambertianMaterial from '../raytracer-cpu/lambertian';
import MetalMaterial from '../raytracer-cpu/metal';
import { Sphere } from '../raytracer-cpu/sphere';
import { SolidColor, CheckerTexture } from '../raytracer-cpu/texture';
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

  HittableList = 3,
  SpheresHittables = 4,

  LambertianMaterials = 5,

  SolidTextures = 6,
  // CheckerTextures = 7,
  MetalMaterials = 7,
}

export default class WebGPUComputePipline extends WebGPUPipelineBase {
  private _options: WebGPUComputePiplineOptions;

  private _computeParamsUniformBuffer = new WebGPUBuffer();
  private _computeCameraUniformBuffer = new WebGPUBuffer();
  private _pixelBuffer = new WebGPUBuffer();

  private _hittableListBuffer = new WebGPUBuffer();
  private _spheresHittablesBuffer = new WebGPUBuffer();
  private _lambertianMaterialsBuffer = new WebGPUBuffer();
  private _solidTexturesBuffer = new WebGPUBuffer();
  // private _checkerTexturesBuffer = new WebGPUBuffer();
  private _metalMaterialsBuffer = new WebGPUBuffer();

  public constructor(options: WebGPUComputePiplineOptions) {
    super();
    this._options = options;
    this._options.uniformParams.fRandomSeed = Math.random();
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
          binding: Bindings.HittableList,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        {
          binding: Bindings.SpheresHittables,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        {
          binding: Bindings.LambertianMaterials,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        {
          binding: Bindings.SolidTextures,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
        // {
        //   binding: Bindings.CheckerTextures,
        //   visibility: GPUShaderStage.COMPUTE,
        //   type: 'storage-buffer',
        // },
        {
          binding: Bindings.MetalMaterials,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer',
        },
      ],
    });

    await this.createBindGroup();

    this.resetObjects();
  }

  private resetObjects(): void {
    HittableList.resetGPUBuffer();
    Sphere.resetGPUBuffer();
    LambertianMaterial.resetGPUBuffer();
    SolidColor.resetGPUBuffer();
    CheckerTexture.resetGPUBuffer();
    MetalMaterial.resetGPUBuffer();
  }

  public createObjects(): void {
    this._hittableListBuffer.createWithArrayMapped(HittableList.gpuBufferArray, GPUBufferUsage.STORAGE);
    this._spheresHittablesBuffer.createWithArrayMapped(Sphere.gpuBufferArray, GPUBufferUsage.STORAGE);
    this._lambertianMaterialsBuffer.createWithArrayMapped(LambertianMaterial.gpuBufferArray, GPUBufferUsage.STORAGE);
    this._solidTexturesBuffer.createWithArrayMapped(SolidColor.gpuBufferArray, GPUBufferUsage.STORAGE);
    // this._checkerTexturesBuffer.createWithArrayMapped(CheckerTexture.gpuBufferArray, GPUBufferUsage.STORAGE);
    this._metalMaterialsBuffer.createWithArrayMapped(MetalMaterial.gpuBufferArray, GPUBufferUsage.STORAGE);
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
          binding: Bindings.HittableList,
          resource: {
            buffer: this._hittableListBuffer.gpuBuffer,
            offset: 0,
            size: this._hittableListBuffer.size,
          },
        },
        {
          binding: Bindings.SpheresHittables,
          resource: {
            buffer: this._spheresHittablesBuffer.gpuBuffer,
            offset: 0,
            size: this._spheresHittablesBuffer.size,
          },
        },
        {
          binding: Bindings.LambertianMaterials,
          resource: {
            buffer: this._lambertianMaterialsBuffer.gpuBuffer,
            offset: 0,
            size: this._lambertianMaterialsBuffer.size,
          },
        },
        {
          binding: Bindings.SolidTextures,
          resource: {
            buffer: this._solidTexturesBuffer.gpuBuffer,
            offset: 0,
            size: this._solidTexturesBuffer.size,
          },
        },
        // {
        //   binding: Bindings.CheckerTextures,
        //   resource: {
        //     buffer: this._checkerTexturesBuffer.gpuBuffer,
        //     offset: 0,
        //     size: this._checkerTexturesBuffer.size,
        //   },
        // },
        {
          binding: Bindings.MetalMaterials,
          resource: {
            buffer: this._metalMaterialsBuffer.gpuBuffer,
            offset: 0,
            size: this._metalMaterialsBuffer.size,
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
