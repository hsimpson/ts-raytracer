import WebGPUPipelineBase from './webgpupipelinebase';
import WebGPUContext from './webgpucontext';
import { createBuffer } from './webgpuhelpers';

interface RenderUniformParams {
  fWidth: number;
  fHeight: number;
  fSample: number;
}

interface WebGPURenderPipelineOptions {
  vertexShaderUrl: string;
  fragmentShaderUrl: string;
  sharedPixelBuffer: GPUBuffer;
  uniformParams: RenderUniformParams;
}

/* eslint-disable indent */

const _attributeElementCount = 3;
// prettier-ignore
const _vertexPositions = new Float32Array([
  // triangle top left
  -1.0,  1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0,

  // triangle bottom right
   1.0,  1.0, 0.0,
   1.0, -1.0, 0.0,
  -1.0, -1.0, 0.0,
]);

/* eslint-enable indent */

export default class WebGPURenderPipeline extends WebGPUPipelineBase {
  private _options: WebGPURenderPipelineOptions;
  private _vertexPositionBuffer: GPUBuffer;
  private _vertexColorBuffer: GPUBuffer;

  private _renderParamsUniformBuffer: GPUBuffer;
  private _renderParamsUniformBufferSize = 0;

  public constructor(options: WebGPURenderPipelineOptions) {
    super();
    this._options = options;
  }

  public async initialize(context: WebGPUContext): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    this._context = context;

    this._vertexPositionBuffer = createBuffer(this._context.device, _vertexPositions, GPUBufferUsage.VERTEX);

    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._renderParamsUniformBufferSize = uniformArray.byteLength;
    this._renderParamsUniformBuffer = createBuffer(
      context.device,
      uniformArray,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    );

    this._bindGroupLayout = this._context.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          type: 'uniform-buffer',
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          type: 'storage-buffer',
        },
      ],
    });

    await this.createBindGroup();
  }

  protected async createBindGroup(): Promise<void> {
    this._bindGroup = this._context.device.createBindGroup({
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._renderParamsUniformBuffer,
            offset: 0,
            size: this._renderParamsUniformBufferSize,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this._options.sharedPixelBuffer,
            offset: 0,
            size:
              this._options.uniformParams.fWidth *
              this._options.uniformParams.fHeight *
              4 *
              Float32Array.BYTES_PER_ELEMENT,
          },
        },
      ],
    });

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = this._context.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout],
    });

    const vertexStage: GPUProgrammableStageDescriptor = {
      module: await this.loadShader(this._context, this._options.vertexShaderUrl),
      entryPoint: 'main',
    };

    const fragmentStage: GPUProgrammableStageDescriptor = {
      module: await this.loadShader(this._context, this._options.fragmentShaderUrl),
      entryPoint: 'main',
    };

    const colorState: GPUColorStateDescriptor = {
      format: 'bgra8unorm',
      alphaBlend: {
        srcFactor: 'src-alpha',
        dstFactor: 'one-minus-src-alpha',
        operation: 'add',
      },
      colorBlend: {
        srcFactor: 'src-alpha',
        dstFactor: 'one-minus-src-alpha',
        operation: 'add',
      },
      writeMask: GPUColorWrite.ALL,
    };

    const rasterizationState: GPURasterizationStateDescriptor = {
      frontFace: 'cw',
      cullMode: 'none',
    };

    const vertexAttributes: GPUVertexAttributeDescriptor[] = [
      {
        shaderLocation: 0,
        offset: 0,
        format: 'float3',
      },
    ];

    const vertexBufferDesc: GPUVertexBufferLayoutDescriptor = {
      attributes: vertexAttributes,
      arrayStride: _attributeElementCount * Float32Array.BYTES_PER_ELEMENT,
      stepMode: 'vertex',
    };

    const vertexState: GPUVertexStateDescriptor = {
      vertexBuffers: [vertexBufferDesc],
    };

    const pipelineDesc: GPURenderPipelineDescriptor = {
      layout,
      vertexStage,
      fragmentStage,
      primitiveTopology: 'triangle-list',
      colorStates: [colorState],
      rasterizationState,
      vertexState,
      sampleCount: 1,
    };

    this._pipeline = this._context.device.createRenderPipeline(pipelineDesc);
  }

  public updateUniformBuffer(sample: number): void {
    if (this._initialized) {
      this._options.uniformParams.fSample = sample;
      const uniformArray = this.getParamsArray(this._options.uniformParams);
      this._context.queue.writeBuffer(this._renderParamsUniformBuffer, 0, uniformArray.buffer);
    }
  }

  public get gpuPipeline(): GPURenderPipeline {
    return this._pipeline as GPURenderPipeline;
  }

  public get vertexPostionBuffer(): GPUBuffer {
    return this._vertexPositionBuffer;
  }
}
