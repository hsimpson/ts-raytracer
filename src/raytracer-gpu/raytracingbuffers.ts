import { mat4 } from 'gl-matrix';
import { XYRect, XZRect, YZRect } from '../raytracer-cpu/aarect';
import { Box } from '../raytracer-cpu/box';
import { DielectricMaterial } from '../material/dielectric';
import { DiffuseLight } from '../material/diffuselight';
import { Hittable } from '../raytracer-cpu/hittable';
import { HittableList } from '../raytracer-cpu/hittablelist';
import { LambertianMaterial } from '../material/lambertian';
import { Material } from '../material/material';
import { MetalMaterial } from '../material/metal';
import { MovingSphere } from '../raytracer-cpu/movingsphere';
import { Sphere } from '../raytracer-cpu/sphere';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor, Texture } from '../raytracer-cpu/texture';
import { nextPowerOf2 } from '../util';
import type { Vec3 } from '../vec3';
import { WebGPUContext } from './webgpucontext';

enum WebGPUMaterialType {
  Lambertian = 0,
  Metal = 1,
  Dielectric = 2,
  IsoTropic = 3,
  DiffuseLight = 4,
}

export enum WebGPUPrimitiveType {
  Sphere = 0,
  MovingSphere = 1,
  XYRect = 2,
  XZRect = 3,
  YZRect = 4,
  // ConstantMedium = 5,
  // HittableList = 99,
}

export enum WebGPUTextureType {
  Solid = 0,
  Checker = 1,
  Noise = 2,
  Image = 3,
}

interface WebGPUTexture {
  color: [...rgb: Vec3, a: number]; // TODO: use vec4
  checkerOdd: [...rgb: Vec3, a: number]; // TODO: use vec4
  checkerEven: [...rgb: Vec3, a: number]; // TODO: use vec4
  uvOffset: [u: number, v: number]; // TODO use vec2
  noiseScale: number;
  textureType: number;
  imageTextureIndex: number;

  // padding
  pad_0: number;
  pad_1: number;
  pad_2: number;

  // optional for managing
  hasImageTexture?: boolean;
}
interface WebGPUMaterial {
  baseColor: [...rgb: Vec3, a: number]; // TODO: use vec4
  roughness: number;
  indexOfRefraction: number;
  materialType: WebGPUMaterialType;
  textureIndex: number;
}

interface WebGPUPrimitive {
  modelMatrix: mat4;
  bounds: [...abc: Vec3, d: number]; // TODO: use vec4
  center0: [...rgb: Vec3, a: number]; // TODO: use vec4
  center1: [...rgb: Vec3, a: number]; // TODO: use vec4
  radius: number;
  k: number;

  primitiveType: number;
  materialIndex: number;

  // padding
  // pad_0: number;
}

const PADDING_VALUE = -99;

function log(message: string, bufferData: ArrayBuffer): void {
  const bytes = new Uint8Array(bufferData);
  let byteString = '';
  bytes.forEach((value) => {
    byteString += value.toString(16).padStart(2, '0') + '';
  });
  console.log(message, byteString);
}

export class RaytracingBuffers {
  private _gpuMaterials: WebGPUMaterial[] = [];
  private _gpuPrimitives: WebGPUPrimitive[] = [];
  private _gpuTextures: WebGPUTexture[] = [];
  private _textureSize = 2;
  private _imageTextures: ImageTexture[] = [];

  public constructor(world: HittableList) {
    this.traverseHittables(world, mat4.create());
  }

  public get hasImageTextures(): boolean {
    return this._imageTextures.length > 0;
  }

  private traverseHittables(list: HittableList, modelMatrix: mat4): void {
    for (const object of list.objects) {
      const objectModelMatrix = object.transform.modelMatrix;
      mat4.multiply(objectModelMatrix, modelMatrix, objectModelMatrix);

      if (object instanceof Box) {
        this.traverseHittables(object.sides, objectModelMatrix);
      } else {
        this.addPrimitive(object, objectModelMatrix);
      }
    }
  }

  private addTexture(tex: Texture): number {
    const idx = this._gpuTextures.length;
    let gpuTex: WebGPUTexture;

    if (tex instanceof SolidColor) {
      gpuTex = {
        color: [...tex.color, 1],
        checkerOdd: [1, 1, 1, 1],
        checkerEven: [1, 1, 1, 1],
        uvOffset: [1, 1],
        noiseScale: 1,
        textureType: WebGPUTextureType.Solid,
        imageTextureIndex: -1,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,
      };
    } else if (tex instanceof CheckerTexture) {
      gpuTex = {
        color: [1, 1, 1, 1],
        checkerOdd: [...tex.odd, 1],
        checkerEven: [...tex.even, 1],
        uvOffset: [1, 1],
        noiseScale: 1,
        textureType: WebGPUTextureType.Checker,
        imageTextureIndex: -1,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,
      };
    } else if (tex instanceof NoiseTexture) {
      gpuTex = {
        color: [1, 1, 1, 1],
        checkerOdd: [1, 1, 1, 1],
        checkerEven: [1, 1, 1, 1],
        uvOffset: [1, 1],
        noiseScale: tex.scale,
        textureType: WebGPUTextureType.Noise,
        imageTextureIndex: -1,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,
      };
    } else if (tex instanceof ImageTexture) {
      this._textureSize = Math.max(this.getNextPowerOf2(tex.width, tex.height), this._textureSize);
      gpuTex = {
        color: [1, 1, 1, 1],
        checkerOdd: [1, 1, 1, 1],
        checkerEven: [1, 1, 1, 1],
        uvOffset: [1, 1],
        noiseScale: 1,
        textureType: WebGPUTextureType.Image,
        imageTextureIndex: this._imageTextures.length,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,

        hasImageTexture: true,
      };
      this._imageTextures.push(tex);
    }

    this._gpuTextures.push(gpuTex);

    return idx;
  }

  private addMaterial(mat: Material): number {
    const idx = this._gpuMaterials.length;
    let gpuMat: WebGPUMaterial;

    const tex = mat.texture;
    const textureIndex = mat.texture ? this.addTexture(tex) : -1;

    if (mat instanceof LambertianMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.Lambertian,
        textureIndex,
      };
    } else if (mat instanceof MetalMaterial) {
      gpuMat = {
        baseColor: [...mat.baseColor, 1],
        roughness: mat.roughness,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.Metal,
        textureIndex,
      };
    } else if (mat instanceof DielectricMaterial) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: mat.indexOfRefraction,
        materialType: WebGPUMaterialType.Dielectric,
        textureIndex,
      };
    } else if (mat instanceof DiffuseLight) {
      gpuMat = {
        baseColor: [1, 1, 1, 1],
        roughness: 0,
        indexOfRefraction: 1,
        materialType: WebGPUMaterialType.DiffuseLight,
        textureIndex,
      };
    }

    this._gpuMaterials.push(gpuMat);

    return idx;
  }

  private addPrimitive(obj: Hittable, modelMatrix: mat4): number {
    const idx = this._gpuPrimitives.length;
    let gpuPrimitive: WebGPUPrimitive;

    const mat = obj.material;
    const materialIndex = obj.material ? this.addMaterial(mat) : -1;

    if (obj instanceof Sphere) {
      gpuPrimitive = {
        modelMatrix,
        bounds: [0, 0, 0, 0],
        center0: [...obj.center, 0],
        center1: [0, 0, 0, 1],
        radius: obj.radius,
        k: 0,

        primitiveType: WebGPUPrimitiveType.Sphere,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof MovingSphere) {
      gpuPrimitive = {
        modelMatrix,
        bounds: [0, 0, 0, 0],
        center0: [...obj.center0, obj.time0],
        center1: [...obj.center1, obj.time1],
        radius: obj.radius,
        k: 0,

        primitiveType: WebGPUPrimitiveType.MovingSphere,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof XYRect) {
      gpuPrimitive = {
        modelMatrix,
        bounds: [obj.x0, obj.x1, obj.y0, obj.y1],
        center0: [0, 0, 0, 0],
        center1: [0, 0, 0, 1],
        radius: 0,
        k: obj.k,

        primitiveType: WebGPUPrimitiveType.XYRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof XZRect) {
      gpuPrimitive = {
        modelMatrix,
        bounds: [obj.x0, obj.x1, obj.z0, obj.z1],
        center0: [0, 0, 0, 0],
        center1: [0, 0, 0, 1],
        radius: 0,
        k: obj.k,

        primitiveType: WebGPUPrimitiveType.XZRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    } else if (obj instanceof YZRect) {
      gpuPrimitive = {
        modelMatrix,
        bounds: [obj.y0, obj.y1, obj.z0, obj.z1],
        center0: [0, 0, 0, 0],
        center1: [0, 0, 0, 1],
        radius: 0,
        k: obj.k,

        primitiveType: WebGPUPrimitiveType.YZRect,
        materialIndex,

        // pad_0: PADDING_VALUE,
      };
    }

    if (gpuPrimitive) {
      this._gpuPrimitives.push(gpuPrimitive);
    }
    return idx;
  }

  private getNextPowerOf2(width: number, height: number): number {
    return nextPowerOf2(Math.max(width, height));
  }

  public textureBuffer(): ArrayBuffer {
    const elementCount = 20;
    const materialSize = elementCount * 4;

    const bufferData = new ArrayBuffer(materialSize * this._gpuTextures.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const texture of this._gpuTextures) {
      bufferDataF32[offset++] = texture.color[0];
      bufferDataF32[offset++] = texture.color[1];
      bufferDataF32[offset++] = texture.color[2];
      bufferDataF32[offset++] = texture.color[3];

      bufferDataF32[offset++] = texture.checkerOdd[0];
      bufferDataF32[offset++] = texture.checkerOdd[1];
      bufferDataF32[offset++] = texture.checkerOdd[2];
      bufferDataF32[offset++] = texture.checkerOdd[3];

      bufferDataF32[offset++] = texture.checkerEven[0];
      bufferDataF32[offset++] = texture.checkerEven[1];
      bufferDataF32[offset++] = texture.checkerEven[2];
      bufferDataF32[offset++] = texture.checkerEven[3];

      let uOffset = texture.uvOffset[0];
      let vOffset = texture.uvOffset[0];
      if (texture.hasImageTexture) {
        const tex = this._imageTextures[texture.imageTextureIndex];
        uOffset = tex.width / this._textureSize;
        vOffset = tex.height / this._textureSize;
      }

      bufferDataF32[offset++] = uOffset;
      bufferDataF32[offset++] = vOffset;

      bufferDataF32[offset++] = texture.noiseScale;

      bufferDataU32[offset++] = texture.textureType;
      bufferDataU32[offset++] = texture.imageTextureIndex;

      // paddings
      bufferDataF32[offset++] = texture.pad_0;
      bufferDataF32[offset++] = texture.pad_1;
      bufferDataF32[offset++] = texture.pad_2;
    }

    // log('Textures:', bufferData);
    return bufferData;
  }

  public async imageTexture(): Promise<{ sampler: GPUSampler; textureView: GPUTextureView }> {
    const sampler = WebGPUContext.device.createSampler({
      minFilter: 'linear',
      magFilter: 'linear',
      // addressModeU: 'repeat',
      // addressModeV: 'repeat',
      // addressModeW: 'repeat',
    });

    /*
    dictionary GPUTextureDescriptor : GPUObjectDescriptorBase {
      required GPUExtent3D size;
      GPUIntegerCoordinate mipLevelCount = 1;
      GPUSize32 sampleCount = 1;
      GPUTextureDimension dimension = "2d";
      required GPUTextureFormat format;
      required GPUTextureUsageFlags usage;
    };
    */

    let imageBitmap: ImageBitmap;

    const imageSize = {
      width: 2,
      height: 2,
      depth: 1,
    };

    if (this._imageTextures.length) {
      const tex = this._imageTextures[0];
      const image = new Image();
      image.src = tex.url;
      await image.decode();
      imageBitmap = await window.createImageBitmap(image);
      imageSize.width = tex.width;
      imageSize.height = tex.height;
    } else {
      // create fake imageBitmap
      imageBitmap = await window.createImageBitmap(new ImageData(2, 2));
    }

    const texture = WebGPUContext.device.createTexture({
      size: imageSize,
      // mipLevelCount: 1,
      // sampleCount: 1,
      // dimension: '2d',
      format: 'rgba8unorm', // rgba8unorm-srgb ???
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
    });

    /*
    dictionary GPUTextureViewDescriptor : GPUObjectDescriptorBase {
      GPUTextureFormat format;
      GPUTextureViewDimension dimension;
      GPUTextureAspect aspect = "all";
      GPUIntegerCoordinate baseMipLevel = 0;
      GPUIntegerCoordinate mipLevelCount;
      GPUIntegerCoordinate baseArrayLayer = 0;
      GPUIntegerCoordinate arrayLayerCount;
    };
    */

    const textureView = texture
      .createView
      /*
      {
      format: 'rgba8unorm', // rgba8unorm-srgb ???
      dimension: '2d-array',
      aspect: 'all',
      baseArrayLayer: 0,
      baseMipLevel: 0,
      arrayLayerCount: this._imageTextures.length,
      mipLevelCount: 1,
    }*/
      ();

    WebGPUContext.queue.copyImageBitmapToTexture({ imageBitmap }, { texture }, imageSize);

    /*
    const textureCopyBuffer = new WebGPUBuffer();
    textureCopyBuffer.create(
      this._textureSize * this._textureSize * 4,
      GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    );

    for (let i = 0; i < this._imageTextures.length; i++) {
      const tex = this._imageTextures[i];
      const data = tex.data;
      WebGPUContext.queue.writeBuffer(textureCopyBuffer.gpuBuffer, 0, data);

      const commandEncoder = WebGPUContext.device.createCommandEncoder();
      commandEncoder.copyBufferToTexture(
        {
          buffer: textureCopyBuffer.gpuBuffer,
          bytesPerRow: this._textureSize * 4,
        },
        {
          texture,
        },
        {
          width: this._textureSize,
          height: this._textureSize,
          depth: i,
        }
      );
      WebGPUContext.queue.submit([commandEncoder.finish()]);
    }*/

    return { sampler, textureView };
  }

  public materialBuffer(): ArrayBuffer {
    const elementCount = 8;
    const materialSize = elementCount * 4;

    const bufferData = new ArrayBuffer(materialSize * this._gpuMaterials.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const material of this._gpuMaterials) {
      bufferDataF32[offset++] = material.baseColor[0];
      bufferDataF32[offset++] = material.baseColor[1];
      bufferDataF32[offset++] = material.baseColor[2];
      bufferDataF32[offset++] = material.baseColor[3];

      bufferDataF32[offset++] = material.roughness;
      bufferDataF32[offset++] = material.indexOfRefraction;
      bufferDataU32[offset++] = material.materialType;
      bufferDataU32[offset++] = material.textureIndex;
    }

    //log('Materials:', bufferData);
    return bufferData;
  }

  public primitiveBuffer(): ArrayBuffer {
    const elementCount = 32;
    const primitiveSize = elementCount * 4;

    const bufferData = new ArrayBuffer(primitiveSize * this._gpuPrimitives.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const primitiv of this._gpuPrimitives) {
      bufferDataF32[offset++] = primitiv.modelMatrix[0];
      bufferDataF32[offset++] = primitiv.modelMatrix[1];
      bufferDataF32[offset++] = primitiv.modelMatrix[2];
      bufferDataF32[offset++] = primitiv.modelMatrix[3];
      bufferDataF32[offset++] = primitiv.modelMatrix[4];
      bufferDataF32[offset++] = primitiv.modelMatrix[5];
      bufferDataF32[offset++] = primitiv.modelMatrix[6];
      bufferDataF32[offset++] = primitiv.modelMatrix[7];
      bufferDataF32[offset++] = primitiv.modelMatrix[8];
      bufferDataF32[offset++] = primitiv.modelMatrix[9];
      bufferDataF32[offset++] = primitiv.modelMatrix[10];
      bufferDataF32[offset++] = primitiv.modelMatrix[11];
      bufferDataF32[offset++] = primitiv.modelMatrix[12];
      bufferDataF32[offset++] = primitiv.modelMatrix[13];
      bufferDataF32[offset++] = primitiv.modelMatrix[14];
      bufferDataF32[offset++] = primitiv.modelMatrix[15];

      bufferDataF32[offset++] = primitiv.bounds[0];
      bufferDataF32[offset++] = primitiv.bounds[1];
      bufferDataF32[offset++] = primitiv.bounds[2];
      bufferDataF32[offset++] = primitiv.bounds[3];

      bufferDataF32[offset++] = primitiv.center0[0];
      bufferDataF32[offset++] = primitiv.center0[1];
      bufferDataF32[offset++] = primitiv.center0[2];
      bufferDataF32[offset++] = primitiv.center0[3];

      bufferDataF32[offset++] = primitiv.center1[0];
      bufferDataF32[offset++] = primitiv.center1[1];
      bufferDataF32[offset++] = primitiv.center1[2];
      bufferDataF32[offset++] = primitiv.center1[3];

      bufferDataF32[offset++] = primitiv.radius;
      bufferDataF32[offset++] = primitiv.k;

      bufferDataU32[offset++] = primitiv.primitiveType;
      bufferDataU32[offset++] = primitiv.materialIndex;
    }

    // log('Primitives:', bufferData);

    return bufferData;
  }
}
