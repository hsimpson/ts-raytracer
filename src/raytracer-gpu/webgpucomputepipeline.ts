import { BufferDataTypeKind, ScalarType, WebGPUBuffer, WebGPUContext } from '@donnerknalli/webgpu-utils';
import { Vec2n, Vec3 } from 'wgpu-matrix';
import { Camera as CameraObject } from '../camera';
import { HitableList } from '../hitables';
import { ComputeTile } from '../tiles';
import { RaytracingBuffers } from './raytracingbuffers';
import { WebGPUPipelineBase } from './webgpupipelinebase';

interface ComputeUniformParams {
  background: Vec3;
  tileOffset: Vec2n;
  imageSize: Vec2n;
  currentSample: number;
  maxBounces: number;
}

interface WebGPUComputePipelineOptions {
  computeShaderUrl: URL;
  computeUniformParams: ComputeUniformParams;
  webGpuContext: WebGPUContext;
  camera: CameraObject;
  world: HitableList;
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

export class WebGPUComputePipeline extends WebGPUPipelineBase {
  private readonly _options: WebGPUComputePipelineOptions;
  private readonly _raytracingBuffers: RaytracingBuffers;

  private _computeParamsUniformBuffer!: WebGPUBuffer;
  private _computeCameraUniformBuffer!: WebGPUBuffer;
  private _pixelBuffer!: WebGPUBuffer;
  private _accumulationBuffer!: WebGPUBuffer;
  private _primitivesBuffer!: WebGPUBuffer;
  private _materialsBuffer!: WebGPUBuffer;
  private _texturesBuffer!: WebGPUBuffer;

  public constructor(options: WebGPUComputePipelineOptions) {
    super(options.webGpuContext);
    this._options = options;
    this._options.computeUniformParams.currentSample = 0;

    this._raytracingBuffers = new RaytracingBuffers(this._options.world, this._options.webGpuContext);
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    // 4 floats per pixel (rgba)
    const pixelBufferSize =
      this._options.computeUniformParams.imageSize[0] * this._options.computeUniformParams.imageSize[1] * 4;

    //COPY_SRC is needed because the pixel buffer is read after each compute call
    this._pixelBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      label: 'pixelBuffer',
    });
    this._pixelBuffer.setData('pixelBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._pixelBuffer.writeBuffer();

    this._accumulationBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      label: 'accumulationBuffer',
    });
    this._accumulationBuffer.setData('accumulationBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._accumulationBuffer.writeBuffer();

    this._computeCameraUniformBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: 'computeCameraUniformBuffer',
    });
    const cameraArray = this._options.camera.getUniformArray();
    this._computeCameraUniformBuffer.setData('camera', {
      data: cameraArray,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._computeCameraUniformBuffer.writeBuffer();

    this._primitivesBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'primitivesBuffer',
    });
    this._primitivesBuffer.setData('primitives', {
      data: new Float32Array(this._raytracingBuffers.primitiveBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._primitivesBuffer.writeBuffer();

    this._materialsBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'materialsBuffer',
    });
    this._materialsBuffer.setData('materials', {
      data: new Float32Array(this._raytracingBuffers.materialBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._materialsBuffer.writeBuffer();

    this._texturesBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'texturesBuffer',
    });
    this._texturesBuffer.setData('textures', {
      data: new Float32Array(this._raytracingBuffers.textureBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._texturesBuffer.writeBuffer();

    this.createComputeUniformBuffer();

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

    this._bindGroupLayout = this._options.webGpuContext.device.createBindGroupLayout(bindGroupLayoutDescriptor);

    await this.createBindGroup();
  }

  private createComputeUniformBuffer() {
    this._computeParamsUniformBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: 'computeParamsUniformBuffer',
    });

    // FIXME: hardcoding the uniform buffer layout here, consider creating a helper function to build the buffer with proper alignment

    // Build uniform buffer as a single array with proper WGSL alignment
    // background: vec3<f32> at offset 0 (12 bytes + 4 padding)
    // tileOffset: vec2<u32> at offset 16 (8 bytes)
    // imageSize: vec2<u32> at offset 24 (8 bytes)
    // currentSample: u32 at offset 32 (4 bytes)
    // maxBounces: u32 at offset 36 (4 bytes)
    const uniformData = new ArrayBuffer(48); // 40 bytes + padding to 48 for alignment
    const f32View = new Float32Array(uniformData);
    const u32View = new Uint32Array(uniformData);

    const bg = this._options.computeUniformParams.background;
    f32View[0] = bg[0];
    f32View[1] = bg[1];
    f32View[2] = bg[2];
    // f32View[3] is padding

    u32View[4] = this._options.computeUniformParams.tileOffset[0];
    u32View[5] = this._options.computeUniformParams.tileOffset[1];

    u32View[6] = this._options.computeUniformParams.imageSize[0];
    u32View[7] = this._options.computeUniformParams.imageSize[1];

    u32View[8] = this._options.computeUniformParams.currentSample;
    u32View[9] = this._options.computeUniformParams.maxBounces;

    this._computeParamsUniformBuffer.setData('computeUniform', {
      data: new Float32Array(uniformData),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });

    this._computeParamsUniformBuffer.writeBuffer();
  }

  public updateUniformBuffer(sample: number, tile: ComputeTile): void {
    if (this._initialized) {
      this._options.computeUniformParams.currentSample = sample;
      this._options.computeUniformParams.tileOffset = [tile.x, tile.y];

      // Rebuild the entire uniform buffer with proper WGSL alignment
      const uniformData = new ArrayBuffer(48);
      const f32View = new Float32Array(uniformData);
      const u32View = new Uint32Array(uniformData);

      const bg = this._options.computeUniformParams.background;
      f32View[0] = bg[0];
      f32View[1] = bg[1];
      f32View[2] = bg[2];
      // f32View[3] is padding

      u32View[4] = this._options.computeUniformParams.tileOffset[0];
      u32View[5] = this._options.computeUniformParams.tileOffset[1];

      u32View[6] = this._options.computeUniformParams.imageSize[0];
      u32View[7] = this._options.computeUniformParams.imageSize[1];

      u32View[8] = this._options.computeUniformParams.currentSample;
      u32View[9] = this._options.computeUniformParams.maxBounces;

      this._computeParamsUniformBuffer.setData('computeUniform', {
        data: new Float32Array(uniformData),
        dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
      });

      this._computeParamsUniformBuffer.writeBuffer();
    }
  }

  protected async createBindGroup(): Promise<void> {
    const bindGroupDescriptor: GPUBindGroupDescriptor = {
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: Bindings.ComputeParams,
          resource: {
            buffer: this._computeParamsUniformBuffer.getRawBuffer(),
            offset: 0,
            size: this._computeParamsUniformBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Camera,
          resource: {
            buffer: this._computeCameraUniformBuffer.getRawBuffer(),
            offset: 0,
            size: this._computeCameraUniformBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.PixelBuffer,
          resource: {
            buffer: this._pixelBuffer.getRawBuffer(),
            offset: 0,
            size: this._pixelBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.AccumulationBuffer,
          resource: {
            buffer: this._accumulationBuffer.getRawBuffer(),
            offset: 0,
            size: this._accumulationBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Primitives,
          resource: {
            buffer: this._primitivesBuffer.getRawBuffer(),
            offset: 0,
            size: this._primitivesBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Materials,
          resource: {
            buffer: this._materialsBuffer.getRawBuffer(),
            offset: 0,
            size: this._materialsBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Textures,
          resource: {
            buffer: this._texturesBuffer.getRawBuffer(),
            offset: 0,
            size: this._texturesBuffer.getRawBuffer().size,
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

    this._bindGroup = this._options.webGpuContext.device.createBindGroup(bindGroupDescriptor);

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = this._options.webGpuContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout],
    });

    const computeStage: GPUProgrammableStage = {
      module: await this.loadShader(this._options.computeShaderUrl),
      entryPoint: 'main',
    };

    const pipelineDesc: GPUComputePipelineDescriptor = {
      layout,
      compute: computeStage,
    };

    this._pipeline = this._options.webGpuContext.device.createComputePipeline(pipelineDesc);
  }

  public override get gpuPipeline(): GPUComputePipeline {
    return this._pipeline as GPUComputePipeline;
  }

  public get pixelBuffer(): WebGPUBuffer {
    return this._pixelBuffer;
  }
}
