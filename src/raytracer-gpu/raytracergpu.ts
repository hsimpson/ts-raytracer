import {
  BufferDataTypeKind,
  ScalarType,
  WebGPUBindGroup,
  WebGPUBindGroupLayout,
  WebGPUBuffer,
  WebGPUComputePipeline,
  WebGPUContext,
  WebGPUPipelineLayout,
  WebGPURenderPipeline,
  WebGPUShader,
} from '@donnerknalli/webgpu-utils';
import { vec2n, vec3, Vec3 } from 'wgpu-matrix';
import { Camera } from '../camera';
import { HitableList } from '../hitables';
import { DoneCallback, RaytracerBase, RayTracerBaseOptions } from '../raytracerbase';
import { getScene } from '../scenes';
import { ComputeTile, createComputeTiles } from '../tiles';
import { RaytracingBuffers } from './raytracingbuffers';

const LOCAL_SIZE = 8;

export type RayTracerGPUOptions = RayTracerBaseOptions;

const enum Bindings {
  ComputeParams = 0,
  CameraBinding = 1,
  PixelBuffer = 2,
  AccumulationBuffer = 3,

  Primitives = 4,
  Materials = 5,
  Textures = 6,

  Sampler = 7,
  ImageTexture = 8,
}

export class RaytracerGPU extends RaytracerBase {
  private initialized = false;
  private readonly webGpuContext: WebGPUContext;
  private cameraBackground: Vec3 = vec3.zero();

  private vertexPositionBuffer!: WebGPUBuffer;
  private renderParamsUniformBuffer!: WebGPUBuffer;
  private renderBindGroup!: WebGPUBindGroup;
  private renderPipeline!: WebGPURenderPipeline;

  private computeParamsUniformBuffer!: WebGPUBuffer;
  private computePixelBuffer!: WebGPUBuffer;
  private computeBindGroup!: WebGPUBindGroup;
  private computePipeline!: WebGPUComputePipeline;

  public constructor(rayTracerGPUOptions: RayTracerGPUOptions) {
    super();
    this._rayTracerOptions = rayTracerGPUOptions;
    this.webGpuContext = new WebGPUContext(this._rayTracerOptions.canvas);
  }

  public async start(doneCallback?: DoneCallback): Promise<void> {
    console.time('RaytracerGPU initialization');
    this._startTime = performance.now();
    await this.initialize();
    this._doneCallback = doneCallback;
    this._isRunning = true;

    const aspectRatio = this._rayTracerOptions.imageWidth / this._rayTracerOptions.imageHeight;

    const { world, cameraOptions } = await getScene(this._rayTracerOptions.scene);
    this.cameraBackground = cameraOptions.background;

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

    this.computeParamsUniformBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
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

    f32View[0] = this.cameraBackground[0];
    f32View[1] = this.cameraBackground[1];
    f32View[2] = this.cameraBackground[2];
    // f32View[3] is padding

    u32View[4] = 0;
    u32View[5] = 0;

    u32View[6] = this._rayTracerOptions.imageWidth;
    u32View[7] = this._rayTracerOptions.imageHeight;

    u32View[8] = 1;
    u32View[9] = this._rayTracerOptions.maxBounces;

    this.computeParamsUniformBuffer.setData('computeUniform', {
      data: new Float32Array(uniformData),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });

    this.computeParamsUniformBuffer.writeBuffer();

    await this.createComputePipeline(camera, world);
    await this.createRenderPipeline();

    const computeTiles = createComputeTiles(
      this._rayTracerOptions.imageWidth,
      this._rayTracerOptions.imageHeight,
      this._rayTracerOptions.tileSize,
    );
    console.timeEnd('RaytracerGPU initialization');

    await this.renderTiles(computeTiles);

    const duration = performance.now() - this._startTime;
    const stats = `WebGPU -- ${this.getStats(duration)}`;

    if (this._rayTracerOptions.download) {
      const pixelBuffer = await this.copyBuffer();

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

  private async createRenderPipeline(): Promise<void> {
    this.vertexPositionBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
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
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: 'renderParamsUniformBuffer',
    });
    this.renderParamsUniformBuffer.setData('size', {
      data: vec2n.create(this._rayTracerOptions.imageWidth, this._rayTracerOptions.imageHeight),
      dataType: { elementType: ScalarType.Uint32, bufferDataTypeKind: BufferDataTypeKind.Vec2 },
    });
    this.renderParamsUniformBuffer.writeBuffer();

    const vertexShader = new WebGPUShader({
      webGPUContext: this.webGpuContext,
      label: 'vertexShader',
      source: new URL('assets/shaders/renderer.vert.wgsl', globalThis.location.href),
    });
    await vertexShader.createShaderModule();

    const fragmentShader = new WebGPUShader({
      webGPUContext: this.webGpuContext,
      label: 'fragmentShader',
      source: new URL('assets/shaders/renderer.frag.wgsl', globalThis.location.href),
    });
    await fragmentShader.createShaderModule();

    const bindGroupLayout = new WebGPUBindGroupLayout({
      webGPUContext: this.webGpuContext,
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
      webGPUContext: this.webGpuContext,
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
            buffer: this.computePixelBuffer.getRawBuffer(),
          },
        },
      ],
      label: 'bindGroup',
    });
    this.renderBindGroup.createBindGroup();

    const pipelineLayout = new WebGPUPipelineLayout({
      webGPUContext: this.webGpuContext,
      label: 'pipelineLayout',
      bindGroupLayouts: [bindGroupLayout],
    });
    pipelineLayout.createPipelineLayout();

    this.renderPipeline = new WebGPURenderPipeline({
      webGPUContext: this.webGpuContext,
      vertexShader,
      fragmentShader,
      pipelineLayout,
      label: 'renderPipeline',
    });
    this.renderPipeline.addVertexBufferLayout({
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
    this.renderPipeline.setPrimitiveState({
      topology: 'triangle-list',
      frontFace: 'cw',
      cullMode: 'none',
    });
    this.renderPipeline.addColorTargetState({
      format: this.webGpuContext.preferredCanvasFormat,
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
    this.renderPipeline.createRenderPipeline();
  }

  private async createComputePipeline(camera: Camera, world: HitableList): Promise<void> {
    const computeRaytracingBuffers = new RaytracingBuffers(world, this.webGpuContext);

    this.computePixelBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      label: 'computePixelBuffer',
    });

    const pixelBufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4;
    this.computePixelBuffer.setData('pixelBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    this.computePixelBuffer.writeBuffer();

    const computeAccumulationBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      label: 'computeAccumulationBuffer',
    });
    computeAccumulationBuffer.setData('computeAccumulationBuffer', {
      data: new Float32Array(pixelBufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    computeAccumulationBuffer.writeBuffer();

    const computeCameraUniformBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: 'computeCameraUniformBuffer',
    });
    const cameraArray = camera.getUniformArray();
    computeCameraUniformBuffer.setData('camera', {
      data: cameraArray,
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    computeCameraUniformBuffer.writeBuffer();

    const computePrimitivesBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'computePrimitivesBuffer',
    });
    computePrimitivesBuffer.setData('computePrimitivesBuffer', {
      data: new Float32Array(computeRaytracingBuffers.primitiveBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    computePrimitivesBuffer.writeBuffer();

    const computeMaterialsBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'computeMaterialsBuffer',
    });
    computeMaterialsBuffer.setData('computeMaterialsBuffer', {
      data: new Float32Array(computeRaytracingBuffers.materialBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    computeMaterialsBuffer.writeBuffer();

    const computeTexturesBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: 'computeTexturesBuffer',
    });
    computeTexturesBuffer.setData('computeTexturesBuffer', {
      data: new Float32Array(computeRaytracingBuffers.textureBuffer()),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    computeTexturesBuffer.writeBuffer();

    const computeShader = new WebGPUShader({
      webGPUContext: this.webGpuContext,
      label: 'computeShader',
      source: new URL('assets/shaders/raytracer.comp.wgsl', globalThis.location.href),
    });
    await computeShader.createShaderModule();

    const bindGroupLayout = new WebGPUBindGroupLayout({
      webGPUContext: this.webGpuContext,
      label: 'computeBindGroupLayout',
      bindGroupLayoutEntries: [
        {
          binding: Bindings.ComputeParams,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: Bindings.CameraBinding,
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
      ],
    });
    bindGroupLayout.createBindGroupLayout();

    const { sampler, textureView } = await computeRaytracingBuffers.imageTexture();

    this.computeBindGroup = new WebGPUBindGroup({
      webGPUContext: this.webGpuContext,
      label: 'computeBindGroup',
      bindGroupLayout,
      bindGroupEntries: [
        {
          binding: Bindings.ComputeParams,
          resource: {
            buffer: this.computeParamsUniformBuffer.getRawBuffer(),
            offset: 0,
            size: this.computeParamsUniformBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.CameraBinding,
          resource: {
            buffer: computeCameraUniformBuffer.getRawBuffer(),
            offset: 0,
            size: computeCameraUniformBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.PixelBuffer,
          resource: {
            buffer: this.computePixelBuffer.getRawBuffer(),
            offset: 0,
            size: this.computePixelBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.AccumulationBuffer,
          resource: {
            buffer: computeAccumulationBuffer.getRawBuffer(),
            offset: 0,
            size: computeAccumulationBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Primitives,
          resource: {
            buffer: computePrimitivesBuffer.getRawBuffer(),
            offset: 0,
            size: computePrimitivesBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Materials,
          resource: {
            buffer: computeMaterialsBuffer.getRawBuffer(),
            offset: 0,
            size: computeMaterialsBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Textures,
          resource: {
            buffer: computeTexturesBuffer.getRawBuffer(),
            offset: 0,
            size: computeTexturesBuffer.getRawBuffer().size,
          },
        },
        {
          binding: Bindings.Sampler,
          resource: sampler,
        },
        {
          binding: Bindings.ImageTexture,
          resource: textureView,
        },
      ],
    });
    this.computeBindGroup.createBindGroup();

    const pipelineLayout = new WebGPUPipelineLayout({
      webGPUContext: this.webGpuContext,
      label: 'computePipelineLayout',
      bindGroupLayouts: [bindGroupLayout],
    });
    pipelineLayout.createPipelineLayout();

    this.computePipeline = new WebGPUComputePipeline({
      webGPUContext: this.webGpuContext,
      label: 'computePipeline',
      pipelineLayout,
      computeShader,
    });
    this.computePipeline.createComputePipeline();
  }

  private async renderTiles(tiles: ComputeTile[]): Promise<void> {
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
          this.computePass(sample, tiles[tileIndex]);

          if (sample === this._rayTracerOptions.samplesPerPixel) {
            sample = 1;
            tileIndex++;
            if (tileIndex === numOfTiles) {
              this.renderPass();
              resolve();
              return;
            }
          } else {
            sample++;
          }
          duration += globalThis.performance.now() - frameStartTime;
        } while (duration < frequency);
        this.renderPass();

        if (tileIndex < numOfTiles - 1 || sample < this._rayTracerOptions.samplesPerPixel) {
          globalThis.requestAnimationFrame(frame);
        }
      };

      globalThis.requestAnimationFrame(frame);
    });
  }

  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await this.webGpuContext.create();

    this.webGpuContext.gpuCanvasContext.configure({
      device: this.webGpuContext.device,
      format: this.webGpuContext.preferredCanvasFormat,
    });

    this.initialized = true;
  }

  private updateComputeUniformBuffer(sample: number, tile: ComputeTile): void {
    const uniformData = new ArrayBuffer(48);
    const f32View = new Float32Array(uniformData);
    const u32View = new Uint32Array(uniformData);

    f32View[0] = this.cameraBackground[0];
    f32View[1] = this.cameraBackground[1];
    f32View[2] = this.cameraBackground[2];

    u32View[4] = tile.x;
    u32View[5] = tile.y;

    u32View[6] = this._rayTracerOptions.imageWidth;
    u32View[7] = this._rayTracerOptions.imageHeight;

    u32View[8] = sample;
    u32View[9] = this._rayTracerOptions.maxBounces;

    this.computeParamsUniformBuffer.setData('computeUniform', {
      data: new Float32Array(uniformData),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });

    this.computeParamsUniformBuffer.writeBuffer();
  }

  private computePass(sample: number, tile: ComputeTile): void {
    const commandEncoder = this.webGpuContext.device.createCommandEncoder();

    this.updateComputeUniformBuffer(sample, tile);
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.computePipeline.getRawComputePipeline());
    passEncoder.setBindGroup(0, this.computeBindGroup.getRawBindGroup());
    passEncoder.dispatchWorkgroups(tile.width / LOCAL_SIZE, tile.height / LOCAL_SIZE, 1);
    passEncoder.end();

    this.webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private renderPass(): void {
    const commandEncoder = this.webGpuContext.device.createCommandEncoder();

    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.webGpuContext.gpuCanvasContext.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(this.renderPipeline.getRawRenderPipeline());
    passEncoder.setBindGroup(0, this.renderBindGroup.getRawBindGroup());
    passEncoder.setVertexBuffer(0, this.vertexPositionBuffer.getRawBuffer());
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    this.webGpuContext.queue.submit([commandEncoder.finish()]);
  }

  private async copyBuffer(): Promise<Float32Array> {
    const commandEncoder = this.webGpuContext.device.createCommandEncoder();

    const bufferSize = this._rayTracerOptions.imageWidth * this._rayTracerOptions.imageHeight * 4;

    const gpuDestBuffer = new WebGPUBuffer({
      webGPUContext: this.webGpuContext,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      label: 'gpuDestBuffer',
    });

    gpuDestBuffer.setData('copyBuffer', {
      data: new Float32Array(bufferSize),
      dataType: { elementType: ScalarType.Float32, bufferDataTypeKind: BufferDataTypeKind.Array },
    });
    gpuDestBuffer.writeBuffer();

    commandEncoder.copyBufferToBuffer(
      this.computePixelBuffer.getRawBuffer(),
      0,
      gpuDestBuffer.getRawBuffer(),
      0,
      bufferSize * Float32Array.BYTES_PER_ELEMENT,
    );

    this.webGpuContext.queue.submit([commandEncoder.finish()]);
    const arrayBuffer = await gpuDestBuffer.mapRead();

    return new Float32Array(arrayBuffer);
  }
}
