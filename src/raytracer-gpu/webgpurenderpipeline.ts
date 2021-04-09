import { WebGPUBuffer } from './webgpubuffer';
import { WebGPUContext } from './webgpucontext';
import { WebGPUPipelineBase } from './webgpupipelinebase';

interface RenderUniformParams {
  width: number;
  height: number;
}

interface WebGPURenderPipelineOptions {
  vertexShaderUrl: string;
  fragmentShaderUrl: string;
  sharedPixelBuffer: WebGPUBuffer;
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

export class WebGPURenderPipeline extends WebGPUPipelineBase {
  private _options: WebGPURenderPipelineOptions;
  private _vertexPositionBuffer = new WebGPUBuffer();
  // private _vertexColorBuffer = new WebGPUBuffer();

  private _renderParamsUniformBuffer = new WebGPUBuffer();

  public constructor(options: WebGPURenderPipelineOptions) {
    super();
    this._options = options;
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    this._vertexPositionBuffer.createWithArrayMapped(_vertexPositions, GPUBufferUsage.VERTEX);

    const uniformArray = this.getParamsArray(this._options.uniformParams);
    this._renderParamsUniformBuffer.createWithArrayMapped(uniformArray, GPUBufferUsage.UNIFORM);

    this._bindGroupLayout = WebGPUContext.device.createBindGroupLayout({
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
            type: 'storage',
          },
        },
      ],
    });

    await this.createBindGroup();
  }

  protected async createBindGroup(): Promise<void> {
    this._bindGroup = WebGPUContext.device.createBindGroup({
      layout: this._bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._renderParamsUniformBuffer.gpuBuffer,
            offset: 0,
            size: this._renderParamsUniformBuffer.size,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this._options.sharedPixelBuffer.gpuBuffer,
            offset: 0,
            size: this._options.sharedPixelBuffer.size,
          },
        },
      ],
    });

    this._bindGroup.label = `${this.name}-BindGroup`;

    const layout = WebGPUContext.device.createPipelineLayout({
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

    const pipelineDesc: GPURenderPipelineDescriptorNew = {
      layout,
      vertex: vertexState,
      primitive: primitiveState,
      fragment: fragmentState,

      multisample: {
        count: 1,
      },
    };

    this._pipeline = WebGPUContext.device.createRenderPipeline(pipelineDesc);
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
    return this._vertexPositionBuffer.gpuBuffer;
  }
}
