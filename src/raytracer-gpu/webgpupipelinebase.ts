import { WebGPUContext } from '@donnerknalli/webgpu-utils';
import { WebGPUObjectBase } from './webgpuobjectbase';
import { preprocessShader } from './wgslpreprocessor';

type IUniformParams = Record<string, any>;

export abstract class WebGPUPipelineBase extends WebGPUObjectBase {
  protected _initialized = false;
  protected _pipeline!: GPURenderPipeline | GPUComputePipeline;
  protected _bindGroupLayout!: GPUBindGroupLayout;
  protected _bindGroup!: GPUBindGroup;
  protected _webGpuContext: WebGPUContext;

  public constructor(webGpuContext: WebGPUContext) {
    super();
    this._webGpuContext = webGpuContext;
  }

  private prepareCode(code: string) {
    const lines = code.split('\n');
    let result = '';
    for (let i = 0; i < lines.length; i++) {
      result += `${i + 1}: ${lines[i]}\n`;
    }
    return result;
  }

  protected async loadShader(shaderUrl: URL): Promise<GPUShaderModule> {
    console.log(`compiling shader: ${shaderUrl}`);

    const code = await preprocessShader(shaderUrl);
    const shaderModule = this._webGpuContext.device.createShaderModule({
      code,
    });

    const compilationInfo = await shaderModule.getCompilationInfo();
    for (const message of compilationInfo.messages) {
      if (message.type === 'error') {
        console.error(message.message);
        console.error(this.prepareCode(code));
      }
      if (message.type === 'warning') {
        console.warn(message.message);
        console.warn(this.prepareCode(code));
      }
    }

    return shaderModule;
  }

  protected getParamsArray(object: IUniformParams): Float32Array {
    const keys = Object.keys(object);
    const array = [];
    for (const key of keys) {
      const val = object[key];
      if (Array.isArray(val)) {
        array.push(...val);
      } else {
        array.push(val);
      }
    }
    return new Float32Array(array);
  }

  protected abstract createBindGroup(): Promise<void>;

  public abstract initialize(): Promise<void>;

  public get gpuPipeline(): GPURenderPipeline | GPUComputePipeline {
    return this._pipeline;
  }

  public get bindGroup(): GPUBindGroup {
    return this._bindGroup;
  }
}
