import { BufferDataTypeKind, ScalarType, WebGPUBuffer, WebGPUContext } from '@donnerknalli/webgpu-utils';
import { Vec2n } from 'wgpu-matrix';
import { WebGPUPipelineBase } from './webgpupipelinebase';

interface RenderUniformParams {
  size: Vec2n;
}

interface WebGPURenderPipelineOptions {
  vertexShaderUrl: URL;
  fragmentShaderUrl: URL;
  sharedPixelBuffer: WebGPUBuffer;
  uniformParams: RenderUniformParams;
  webGpuContext: WebGPUContext;
}

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

export class WebGPURenderPipeline extends WebGPUPipelineBase {
  private readonly _options: WebGPURenderPipelineOptions;
  private _vertexPositionBuffer!: WebGPUBuffer;
  private _renderParamsUniformBuffer!: WebGPUBuffer;

  public constructor(options: WebGPURenderPipelineOptions) {
    super(options.webGpuContext);
    this._options = options;
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    this._vertexPositionBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      'vertexPositionBuffer',
    );
    this._vertexPositionBuffer.setData('positions', {
      data: _vertexPositions,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._vertexPositionBuffer.writeBuffer();

    this._renderParamsUniformBuffer = new WebGPUBuffer(
      this._webGpuContext,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      'renderParamsUniformBuffer',
    );
    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._renderParamsUniformBuffer.setData('params', {
      data: uniformArray,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this._renderParamsUniformBuffer.writeBuffer();

    this._bindGroupLayout = this._options.webGpuContext.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: 'read-only-storage',
          },
        },
      ],
    });

    await this.createBindGroup();
  }

  protected async createBindGroup(): Promise<void> {
    this._bindGroup = this._options.webGpuContext.device.createBindGroup({
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._renderParamsUniformBuffer.getRawBuffer(),
            offset: 0,
            size: this._renderParamsUniformBuffer.getRawBuffer().size,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this._options.sharedPixelBuffer.getRawBuffer(),
            offset: 0,
            size: this._options.sharedPixelBuffer.getRawBuffer().size,
          },
        },
      ],
    });

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = this._options.webGpuContext.device.createPipelineLayout({
      bindGroupLayouts: [this._bindGroupLayout],
    });

    const primitiveState: GPUPrimitiveState = {
      topology: 'triangle-list',
      // stripIndexFormat: // TODO
      frontFace: 'cw',
      cullMode: 'none',
    };

    const vertexBufferDesc: GPUVertexBufferLayout = {
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        },
      ],
      arrayStride: _attributeElementCount * Float32Array.BYTES_PER_ELEMENT,
      stepMode: 'vertex',
    };

    const vertexState: GPUVertexState = {
      module: await this.loadShader(this._options.vertexShaderUrl),
      entryPoint: 'main',
      buffers: [vertexBufferDesc],
    };

    const colorState: GPUColorTargetState = {
      format: 'bgra8unorm',
      blend: {
        color: {
          srcFactor: 'src-alpha',
          dstFactor: 'one-minus-src-alpha',
          operation: 'add',
        },
        alpha: {
          srcFactor: 'src-alpha',
          dstFactor: 'one-minus-src-alpha',
          operation: 'add',
        },
      },
      writeMask: GPUColorWrite.ALL,
    };

    const fragmentState: GPUFragmentState = {
      module: await this.loadShader(this._options.fragmentShaderUrl),
      entryPoint: 'main',
      targets: [colorState],
    };

    const pipelineDesc: GPURenderPipelineDescriptor = {
      layout,
      vertex: vertexState,
      primitive: primitiveState,
      fragment: fragmentState,

      multisample: {
        count: 1,
      },
    };

    this._pipeline = this._options.webGpuContext.device.createRenderPipeline(pipelineDesc);
  }

  // public updateUniformBuffer(sample: number): void {
  //   if (this._initialized) {
  //     this._options.uniformParams.fSample = sample;
  //     const uniformArray = this.getParamsArray(this._options.uniformParams);
  //     WebGPUContext.queue.writeBuffer(this._renderParamsUniformBuffer.gpuBuffer, 0, uniformArray.buffer);
  //   }
  // }

  public get gpuPipeline(): GPURenderPipeline {
    return this._pipeline as GPURenderPipeline;
  }

  public get vertexPostionBuffer(): GPUBuffer {
    return this._vertexPositionBuffer.getRawBuffer();
  }
}
