import { WebGPUContext } from './webgpucontext';
import { WebGPUObjectBase } from './webgpuobjectbase';

interface IUniformParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export abstract class WebGPUPipelineBase extends WebGPUObjectBase {
  protected _initialized = false;
  protected _pipeline: GPURenderPipeline | GPUComputePipeline;
  protected _bindGroupLayout: GPUBindGroupLayout;
  protected _bindGroup: GPUBindGroup;

  protected async loadShader(shaderUrl: string): Promise<GPUShaderModule> {
    const response = await fetch(shaderUrl);
    let shaderModule: GPUShaderModule;
    console.log(`compiling shader: ${shaderUrl}`);

    if (shaderUrl.endsWith('wgsl')) {
      shaderModule = WebGPUContext.device.createShaderModule({
        code: await response.text(),
      });
    } else {
      const buffer = await response.arrayBuffer();
      shaderModule = WebGPUContext.device.createShaderModule({
        code: new Uint32Array(buffer),
      });
    }

    const compilationInfo = await shaderModule.compilationInfo();
    for (const message of compilationInfo.messages) {
      console.log(message.message);
    }

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

  protected abstract createBindGroup(): Promise<void>;

  public abstract initialize(context: WebGPUContext): Promise<void>;

  public get gpuPipeline(): GPURenderPipeline | GPUComputePipeline {
    return this._pipeline;
  }

  public get bindGroup(): GPUBindGroup {
    return this._bindGroup;
  }
}
