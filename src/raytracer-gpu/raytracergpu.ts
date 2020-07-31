// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@webgpu/types/dist/index.d.ts" />

import { DoneCallback, RaytracerBase } from '../raytracerbase';
import WebGPUContext from './webgpucontext';
import WebGPUComputePipline from './webgpucomputepipeline';
import Vec3 from '../vec3';
import { randomNumberRange } from '../util';
import Camera from '../camera';
import WebGPURenderPipeline from './webgpurenderpipeline';

export default class RaytracerGPU extends RaytracerBase {
  private _initialized = false;
  private _webGPUContext: WebGPUContext;
  private _context2D: CanvasRenderingContext2D;

  private _colorTextureView: GPUTextureView;
  private _colorAttachment: GPURenderPassColorAttachmentDescriptor;
  private _swapchain: GPUSwapChain;

  public constructor(
    canvas: HTMLCanvasElement,
    imageWidth: number,
    imageHeight: number,
    samplesPerPixel: number,
    maxBounces: number
  ) {
    super(canvas, imageWidth, imageHeight, samplesPerPixel, maxBounces);
  }

  public static supportsWebGPU(): boolean {
    if (navigator.gpu) {
      return true;
    }
    return false;
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

    const textureSize: GPUExtent3D = {
      width: this._imageWidth,
      height: this._imageHeight,
      depth: 1,
    };

    const colorTextureDesc: GPUTextureDescriptor = {
      size: textureSize,
      sampleCount: 1,
      format: 'bgra8unorm',
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    };

    const colorTexture = this._webGPUContext.device.createTexture(colorTextureDesc);
    this._colorTextureView = colorTexture.createView();

    this._colorAttachment = {
      attachment: null,
      loadValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: 'store',
    };

    const randomSceneArray = this.createRandomScene();
    const aspectRatio = this._imageWidth / this._imageHeight;
    const lookFrom = new Vec3(13, 2, 3);
    const lookAt = new Vec3(0, 0, 0);
    const vUp = new Vec3(0, 1, 0);
    const focusDist = 10;
    //const aperture = 0.1;
    const aperture = 0.0;
    const fovY = 20;
    const camera = new Camera();
    camera.init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist);

    const computePipeline = new WebGPUComputePipline({
      computeShaderUrl: 'raytracer.comp.spv',
      uniformParams: {
        fWidth: this._imageWidth,
        fHeight: this._imageHeight,
        fSamplesPerPixel: this._samplesPerPixel,
        fMaxBounces: this._maxBounces,
        fSphereCount: randomSceneArray.length / 12,
      },
      randomScene: randomSceneArray,
      camera,
    });

    await computePipeline.initialize(this._webGPUContext);

    const renderPipeline = new WebGPURenderPipeline({
      vertexShaderUrl: 'renderer.vert.spv',
      fragmentShaderUrl: 'renderer.frag.spv',
      sharedPixelBuffer: computePipeline.pixelBuffer,
      uniformParams: {
        fWidth: this._imageWidth,
        fHeight: this._imageHeight,
        fSample: 1,
      },
    });

    await renderPipeline.initialize(this._webGPUContext);

    const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);

    const raytracing = async (): Promise<void> => {
      return new Promise((resolve) => {
        let sample = 1;
        let prevTime = performance.now();
        const frame = (): void => {
          const currentTime = performance.now();
          console.log(`duration: ${(currentTime - prevTime).toFixed(3)} ms`);
          prevTime = currentTime;
          console.log(`Sample pass ${sample} of ${this._samplesPerPixel}`);

          // async without render pipeline
          // const lastframe = sample === this._samplesPerPixel;
          this.compute(computePipeline, true).then((rayTracedArray) => {
            for (let j = 0; j <= rayTracedArray.length; j++) {
              imageData.data[j] = (rayTracedArray[j] / sample) * 255;
            }
            this._context2D.putImageData(imageData, 0, 0);
            if (sample < this._samplesPerPixel) {
              sample++;
              window.requestAnimationFrame(frame);
            } else {
              resolve();
            }
          });

          // synchron with render pipeline
          //this.compute2(computePipeline, renderPipeline, sample);
          // sample++;
          // if (sample <= this._samplesPerPixel) {
          //   window.requestAnimationFrame(frame);
          // } else {
          //   resolve();
          // }
        };
        window.requestAnimationFrame(frame);
      });
    };

    await raytracing();

    // raytracer finished
    const duration = performance.now() - this._startTime;
    const renderTime = `spp: ${this._samplesPerPixel}, max-bounces: ${
      this._maxBounces
    }, rendertime: ${RaytracerBase.msToTimeString(duration)}`;
    console.log(renderTime);

    this._context2D.font = '16px Arial';
    this._context2D.textBaseline = 'top';
    this._context2D.fillText(renderTime, 5, 5);

    if (this._doneCallback) {
      this._doneCallback(duration);
    }
    this._isRunning = false;
  }

  public stop(): void {
    //
  }

  private async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    const gpu = navigator.gpu;

    const adapter = await gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const queue = device.defaultQueue;

    this._webGPUContext = new WebGPUContext(device, queue);

    this._context2D = this._canvas.getContext('2d');
    // swapchain

    /*
    const context: GPUCanvasContext = (this._canvas.getContext('gpupresent') as unknown) as GPUCanvasContext;
    const swapChainDesc: GPUSwapChainDescriptor = {
      device,
      format: 'bgra8unorm',
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    };
    this._swapchain = context.configureSwapChain(swapChainDesc);
    */
    this._initialized = true;
  }

  private createSphere(
    center: Vec3,
    radius: number,
    material: number,
    albedo: Vec3,
    roughness: number,
    refractIdx: number
  ): number[] {
    const array: number[] = [];
    array.push(...center.array, radius, material, ...albedo.array, roughness, refractIdx);

    // padding;
    array.push(0, 0);

    return array;
  }

  private createRandomScene(): Float32Array {
    const array: number[] = [];

    array.push(...this.createSphere(new Vec3(0.0, -1000, 0.0), 1000, 0.5, new Vec3(0.5, 0.5, 0.5), 0.0, 1.0));
    array.push(...this.createSphere(new Vec3(0.0, 1.0, 0.0), 1.0, 1.0, new Vec3(1.0, 1.0, 1.0), 1.0, 1.5));
    array.push(...this.createSphere(new Vec3(-4.0, 1.0, 0.0), 1.0, 0.5, new Vec3(0.4, 0.2, 0.1), 0.0, 1.0));
    array.push(...this.createSphere(new Vec3(4.0, 1.0, 0.0), 1.0, 0.9, new Vec3(0.7, 0.6, 0.5), 0.0, 1.0));

    for (let a = -11; a < 11; a++) {
      for (let b = -11; b < 11; b++) {
        const chooseMat = Math.random();

        const center = new Vec3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());

        if (Vec3.subVec3(center, new Vec3(4, 0.2, 0)).length() > 0.9) {
          let albedo: Vec3;
          let roughness = 0.0;
          let refIdx = 1.0;

          if (chooseMat < 0.8) {
            albedo = Vec3.multVec3(Vec3.random(), Vec3.random());
          } else if (chooseMat < 0.95) {
            roughness = randomNumberRange(0, 0.5);
            albedo = Vec3.randomRange(0.5, 1);
          } else {
            albedo = new Vec3(1.0, 1.0, 1.0);
            refIdx = 1.5;
          }

          array.push(...this.createSphere(center, 0.2, chooseMat, albedo, roughness, refIdx));
        }
      }
    }

    return new Float32Array(array);
  }

  private async compute(computePipeline: WebGPUComputePipline, copyBuffer = false): Promise<Float32Array> {
    const commandEncoder = this._webGPUContext.device.createCommandEncoder();

    // compute pass
    {
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline.gpuPipeline);
      passEncoder.setBindGroup(0, computePipeline.bindGroup);
      passEncoder.dispatch(this._imageWidth / 8, this._imageHeight / 8, 1);
      passEncoder.endPass();

      computePipeline.updateUniformBuffer();
    }

    if (copyBuffer) {
      const gpuReadBuffer = this._webGPUContext.device.createBuffer({
        size: this._imageWidth * this._imageHeight * 4 * 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });

      commandEncoder.copyBufferToBuffer(
        computePipeline.pixelBuffer,
        0,
        gpuReadBuffer,
        0,
        this._imageWidth * this._imageHeight * 4 * 4
      );
      this._webGPUContext.queue.submit([commandEncoder.finish()]);

      const arrayBuffer = await gpuReadBuffer.mapReadAsync();

      return new Float32Array(arrayBuffer);
    } else {
      this._webGPUContext.queue.submit([commandEncoder.finish()]);
    }
    return new Float32Array(this._imageWidth * this._imageHeight * 4 * 4);
  }

  private compute2(computePipeline: WebGPUComputePipline, renderPipeLine: WebGPURenderPipeline, sample: number): void {
    const commandEncoder = this._webGPUContext.device.createCommandEncoder();

    // compute pass
    {
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline.gpuPipeline);
      passEncoder.setBindGroup(0, computePipeline.bindGroup);
      //passEncoder.dispatch(this._imageWidth, this._imageHeight, 1);
      //passEncoder.dispatch(this._imageWidth * this._imageHeight, 1, 1);
      passEncoder.dispatch(this._imageWidth / 8, this._imageHeight / 8, 1);
      passEncoder.endPass();

      computePipeline.updateUniformBuffer();
    }

    // render pass
    {
      renderPipeLine.updateUniformBuffer(sample);
      this._colorAttachment.attachment = this._swapchain.getCurrentTexture().createView();
      const renderPassDesc: GPURenderPassDescriptor = {
        colorAttachments: [this._colorAttachment],
        //depthStencilAttachment: this._depthAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(renderPipeLine.gpuPipeline);
      passEncoder.setBindGroup(0, renderPipeLine.bindGroup);
      passEncoder.setVertexBuffer(0, renderPipeLine.vertexPostionBuffer);
      passEncoder.draw(6, 1, 0, 0);
      passEncoder.endPass();
    }

    this._webGPUContext.queue.submit([commandEncoder.finish()]);
  }
}
