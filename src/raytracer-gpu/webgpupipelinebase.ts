import { WebGPUContext } from './webgpucontext';
import WebGPUObjectBase from './webgpuobjectbase';

interface IUniformParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default abstract class WebGPUPipelineBase extends WebGPUObjectBase {
  protected _initialized = false;
  protected _pipeline: GPURenderPipeline | GPUComputePipeline;
  protected _bindGroupLayout: GPUBindGroupLayout;
  protected _bindGroup: GPUBindGroup;

  protected async loadShader(shaderUrl: string): Promise<GPUShaderModule> {
    const response = await fetch(shaderUrl);
    const buffer = await response.arrayBuffer();

    const shaderModule = WebGPUContext.device.createShaderModule({
      code: new Uint32Array(buffer),
    });

    return shaderModule;
  }

  protected getParamsArray(object: IUniformParams): Float32Array {
    const keys = Object.keys(object);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
      const val = object[keys[i]];
      if (Array.isArray(val)) {
        array.push(...val);
      } else {
        array.push(val);
      }
    }
    return new Float32Array(array);
  }

  protected abstract async createBindGroup(): Promise<void>;

  public abstract async initialize(context: WebGPUContext): Promise<void>;

  public get gpuPipeline(): GPURenderPipeline | GPUComputePipeline {
    return this._pipeline;
  }

  public get bindGroup(): GPUBindGroup {
    return this._bindGroup;
  }
}
