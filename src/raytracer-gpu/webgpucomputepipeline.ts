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
    this._pixelBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      'pixelBuffer',
    );
    this._pixelBuffer.setData('pixelBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._pixelBuffer.writeBuffer();

    this._accumulationBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      'accumulationBuffer',
    );
    this._accumulationBuffer.setData('accumulationBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._accumulationBuffer.writeBuffer();

    this._computeCameraUniformBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      'computeCameraUniformBuffer',
    );
    const cameraArray = this._options.camera.getUniformArray();
    this._computeCameraUniformBuffer.setData('camera', {
      data: cameraArray,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._computeCameraUniformBuffer.writeBuffer();

    this._primitivesBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      'primitivesBuffer',
    );
    this._primitivesBuffer.setData('primitives', {
      data: new Float32Array(this._raytracingBuffers.primitiveBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._primitivesBuffer.writeBuffer();

    this._materialsBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      'materialsBuffer',
    );
    this._materialsBuffer.setData('materials', {
      data: new Float32Array(this._raytracingBuffers.materialBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._materialsBuffer.writeBuffer();

    this._texturesBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      'texturesBuffer',
    );
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
    this._computeParamsUniformBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      'computeParamsUniformBuffer',
    );
    this._computeParamsUniformBuffer.setData('computeParamsUniform_background', {
      data: this._options.computeUniformParams.background,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Vec3 },
    });
    this._computeParamsUniformBuffer.setData('computeParamsUniform_tileOffset', {
      data: this._options.computeUniformParams.tileOffset,
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Vec2 },
    });
    this._computeParamsUniformBuffer.setData('computeParamsUniform_imageSize', {
      data: this._options.computeUniformParams.imageSize,
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Vec2 },
    });
    this._computeParamsUniformBuffer.setData('computeParamsUniform_currentSample', {
      data: this._options.computeUniformParams.currentSample,
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Scalar },
    });
    this._computeParamsUniformBuffer.setData('computeParamsUniform_maxBounces', {
      data: this._options.computeUniformParams.maxBounces,
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Scalar },
    });

    this._computeParamsUniformBuffer.writeBuffer();
  }

  public updateUniformBuffer(sample: number, tile: ComputeTile): void {
    if (this._initialized) {
      this._options.computeUniformParams.currentSample = sample;
      // this._options.uniformParams.tileOffsetX = tile.x;
      // this._options.uniformParams.tileOffsetY = tile.y;
      this._options.computeUniformParams.tileOffset = [tile.x, tile.y];

      // const uniformArray = this.getParamsArray(this._options.uniformParams);

      // this._computeCameraUniformBuffer.setData('computeParams', {
      //   data: uniformArray,
      //   dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
      // });
      // this._computeParamsUniformBuffer.writeBuffer();
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

  public get gpuPipeline(): GPUComputePipeline {
    return this._pipeline as GPUComputePipeline;
  }

  public get pixelBuffer(): WebGPUBuffer {
    return this._pixelBuffer;
  }
}
