import {
  BufferDataTypeKind,
  ScalarType,
  WebGPUBindGroup,
  WebGPUBindGroupLayout,
  WebGPUBuffer,
  WebGPUContext,
  WebGPUPipelineLayout,
  WebGPURenderPipeline,
  WebGPUShader,
} from '@donnerknalli/webgpu-utils';
import { vec2n } from 'wgpu-matrix';
import { Camera } from '../camera';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { ComputeTile, createComputeTiles } from '../tiles';
import { WebGPUComputePipeline } from './webgpucomputepipeline';

const LOCAL_SIZE = 8;

export type RayTracerGPUOptions = RayTracerBaseOptions;

export class RaytracerGPU extends RaytracerBase {
  private _initialized = false;
  private readonly _webGpuContext: WebGPUContext;

  private renderBindGroup!: WebGPUBindGroup;
  private vertexPositionBuffer!: WebGPUBuffer;
  private renderParamsUniformBuffer!: WebGPUBuffer;

  public constructor(rayTracerGPUOptions: RayTracerGPUOptions) {
    super();
    this._rayTracerOptions = rayTracerGPUOptions;
    this._webGpuContext = new WebGPUContext(this._rayTracerOptions.canvas);
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    console.time('RaytracerGPU initialization');
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;

    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene);

    const camera = new Camera();
    camera.init(
      cameraOptions.lookFrom,
      cameraOptions.lookAt,
      cameraOptions.vUp,
      cameraOptions.fovY,
      aspectRatio,
      cameraOptions.aperture,
      cameraOptions.focusDist,
      0,
      0.1,
    );

    const baseUrl = globalThis.location.href;

    const computePipeline = new WebGPUComputePipeline({
      computeShaderUrl: new URL('assets/shaders/raytracer.comp.wgsl', baseUrl),
      computeUniformParams: {
        background: cameraOptions.background,
        tileOffset: vec2n.zero(),
        imageSize: vec2n.create(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight),
        currentSample: 1,
        maxBounces: this._rayTracerOptions.maxBounces,
      },
      webGpuContext: this._webGpuContext,
      camera,
      world,
    });

    await computePipeline.initialize();

    this.vertexPositionBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      label: 'vertexPositionBuffer',
    });
    this.vertexPositionBuffer.setData('positions', {
      // prettier-ignore
      data: new Float32Array([
        // triangle top left
        -1,  1, 0,
         1,  1, 0,
        -1, -1, 0,

        // triangle bottom right
         1,  1, 0,
         1, -1, 0,
        -1, -1, 0,
    ]),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this.vertexPositionBuffer.writeBuffer();

    this.renderParamsUniformBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: 'renderParamsUniformBuffer',
    });
    this.renderParamsUniformBuffer.setData('size', {
      data: vec2n.create(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight),
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Vec2 },
    });
    this.renderParamsUniformBuffer.writeBuffer();

    const vertexShader = new WebGPUShader({
      source: new URL('assets/shaders/renderer.vert.wgsl', baseUrl),
      webGPUContext: this._webGpuContext,
    });
    await vertexShader.createShaderModule();

    const fragmentShader = new WebGPUShader({
      source: new URL('assets/shaders/renderer.frag.wgsl', baseUrl),
      webGPUContext: this._webGpuContext,
    });
    await fragmentShader.createShaderModule();

    const bindGroupLayout = new WebGPUBindGroupLayout({
      webGPUContext: this._webGpuContext,
      label: 'bindGroupLayout',
      bindGroupLayoutEntries: [
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
    bindGroupLayout.createBindGroupLayout();

    this.renderBindGroup = new WebGPUBindGroup({
      webGPUContext: this._webGpuContext,
      bindGroupLayout,
      bindGroupEntries: [
        {
          binding: 0,
          resource: {
            buffer: this.renderParamsUniformBuffer.getRawBuffer(),
          },
        },
        {
          binding: 1,
          resource: {
            buffer: computePipeline.pixelBuffer.getRawBuffer(),
          },
        },
      ],
      label: 'bindGroup',
    });
    this.renderBindGroup.createBindGroup();

    const pipelineLayout = new WebGPUPipelineLayout({
      webGPUContext: this._webGpuContext,
      bindGroupLayouts: [bindGroupLayout],
      label: 'pipelineLayout',
    });
    pipelineLayout.createPipelineLayout();

    const renderPipeline = new WebGPURenderPipeline({
      webGPUContext: this._webGpuContext,
      vertexShader,
      fragmentShader,
      pipelineLayout,
      label: 'renderPipeline',
    });
    renderPipeline.addVertexBufferLayout({
      arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        },
      ],
      stepMode: 'vertex',
    });
    renderPipeline.setPrimitiveState({
      topology: 'triangle-list',
      frontFace: 'cw',
      cullMode: 'none',
    });
    renderPipeline.addColorTargetState({
      format: this._webGpuContext.preferredCanvasFormat,
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
    });
    renderPipeline.createRenderPipeline();

    const computeTiles = createComputeTiles(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight,
      this._rayTracerOptions.tileSize,
    );
    console.timeEnd('RaytracerGPU initialization');

    await this.renderTiles(computeTiles, computePipeline, renderPipeline);

    const duration = performance.now() - this._startTime;
    const stats = `WebGPU -- ${this.getStats(duration)}`;

    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer(computePipeline);

      const canvas2d = document.createElement('canvas');
      canvas2d.width = this._rayTracerOptions.imageWidth;
      canvas2d.height = this._rayTracerOptions.imageHeight;
      const canvas2dContext = canvas2d.getContext('2d');

      if (!canvas2dContext) {
        throw new Error('Failed to get 2D context');
      }

      const imageData = canvas2dContext.createImageData(
        this._rayTracerOptions.imageWidth,
        this._rayTracerOptions.imageHeight,
      );

      for (let i = 0; i < pixelBuffer.length; i++) {
        imageData.data[i] = pixelBuffer[i] * 255;
      }

      canvas2dContext.putImageData(imageData, 0, 0);
      await this.downloadImage(canvas2dContext, stats);
    }

    if (this._doneCallback) {
      this._doneCallback(stats);
    }
    this._isRunning = false;
  }

  public stop(): void {
    //
  }

  private async renderTiles(
    tiles: ComputeTile[],
    computePipeline: WebGPUComputePipeline,
    renderPipeline: WebGPURenderPipeline,
  ): Promise<void> {
    return new Promise((resolve) => {
      const numOfTiles = tiles.length;
      console.log(`Number of tiles: ${numOfTiles}`);

      let tileIndex = 0;
      let sample = 1;
      const frequency = 16;
      const frame = (): void => {
        const frameStartTime = globalThis.performance.now();
        let duration = 0;
        do {
          this.computePass(computePipeline, sample, tiles[tileIndex]);

          if (sample === this._rayTracerOptions.samplesPerPixel) {
            sample = 1;
            tileIndex++;
            if (tileIndex === numOfTiles) {
              this.renderPass(renderPipeline);
              resolve();
              return;
            }
          } else {
            sample++;
          }
          duration += globalThis.performance.now() - frameStartTime;
        } while (duration < frequency);
        this.renderPass(renderPipeline);

        if (tileIndex < numOfTiles - 1 || sample < this._rayTracerOptions.samplesPerPixel) {
          globalThis.requestAnimationFrame(frame);
        }
      };

      globalThis.requestAnimationFrame(frame);
    });
  }

  private async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    await this._webGpuContext.create();

    this._webGpuContext.gpuCanvasContext.configure({
      device: this._webGpuContext.device,
      format: this._webGpuContext.preferredCanvasFormat,
    });

    this._initialized = true;
  }

  private computePass(computePipeline: WebGPUComputePipeline, sample: number, tile: ComputeTile): void {
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    computePipeline.updateUniformBuffer(sample, tile);
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline.gpuPipeline);
    passEncoder.setBindGroup(0, computePipeline.bindGroup);
    passEncoder.dispatchWorkgroups(tile.width / LOCAL_SIZE, tile.height / LOCAL_SIZE, 1);
    passEncoder.end();

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private renderPass(renderPipeLine: WebGPURenderPipeline): void {
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this._webGpuContext.gpuCanvasContext.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(renderPipeLine.getRawRenderPipeline());
    passEncoder.setBindGroup(0, this.renderBindGroup.getRawBindGroup());
    passEncoder.setVertexBuffer(0, this.vertexPositionBuffer.getRawBuffer());
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private async copyBuffer(computePipeline: WebGPUComputePipeline): Promise<Float32Array> {
    const commandEncoder = this._webGpuContext.device.createCommandEncoder();

    const bufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4;

    const gpuDestBuffer = new WebGPUBuffer({
      webGPUContext: this._webGpuContext,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      label: 'gpuDestBuffer',
    });

    gpuDestBuffer.setData('copyBuffer', {
      data: new Float32Array(bufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    gpuDestBuffer.writeBuffer();

    commandEncoder.copyBufferToBuffer(
      computePipeline.pixelBuffer.getRawBuffer(),
      0,
      gpuDestBuffer.getRawBuffer(),
      0,
      bufferSize * Float32Array.BYTES_PER_ELEMENT,
    );

    this._webGpuContext.queue.submit([commandEncoder.finish()]);
    const arrayBuffer = await gpuDestBuffer.mapRead();

    return new Float32Array(arrayBuffer);
  }
}
