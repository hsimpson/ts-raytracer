import DielectricMaterial from '../raytracer-cpu/dielectric';
import { Hittable } from '../raytracer-cpu/hittable';
import { HittableList } from '../raytracer-cpu/hittablelist';
import LambertianMaterial from '../raytracer-cpu/lambertian';
import Material from '../raytracer-cpu/material';
import MetalMaterial from '../raytracer-cpu/metal';
import { Sphere } from '../raytracer-cpu/sphere';
import { CheckerTexture, Texture } from '../raytracer-cpu/texture';
import { SolidColor } from '../raytracer-cpu/texture';
import type { Vec3 } from '../vec3';

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
  textureType: number;

  // padding
  pad_0: number;
  pad_1: number;
  pad_2: number;
}
interface WebGPUMaterial {
  baseColor: [...rgb: Vec3, a: number]; // TODO: use vec4
  roughness: number;
  indexOfRefraction: number;
  materialType: WebGPUMaterialType;
  textureIndex: number;
}

interface WebGPUPrimitive {
  center: Vec3;
  radius: number;
  primitiveType: number;
  materialIndex: number;

  // padding
  pad_0: number;
  pad_1: number;
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

  public constructor(world: HittableList) {
    this.traverseHittables(world);
  }

  private traverseHittables(list: HittableList): void {
    for (const object of list.objects) {
      this.addPrimitive(object);
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
        textureType: WebGPUTextureType.Solid,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,
      };
    } else if (tex instanceof CheckerTexture) {
      gpuTex = {
        color: [1, 1, 1, 1],
        checkerOdd: [...tex.odd, 1],
        checkerEven: [...tex.even, 1],
        textureType: WebGPUTextureType.Checker,
        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
        pad_2: PADDING_VALUE,
      };
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
    }

    this._gpuMaterials.push(gpuMat);

    return idx;
  }

  private addPrimitive(obj: Hittable): number {
    const idx = this._gpuPrimitives.length;
    let gpuPrimitive: WebGPUPrimitive;

    const mat = obj.material;
    const materialIndex = obj.material ? this.addMaterial(mat) : -1;

    if (obj instanceof Sphere) {
      gpuPrimitive = {
        center: obj.center,
        radius: obj.radius,
        primitiveType: WebGPUPrimitiveType.Sphere,
        materialIndex,

        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
      };
    }

    this._gpuPrimitives.push(gpuPrimitive);
    return idx;
  }

  public textureBuffer(): ArrayBuffer {
    const elementCount = 16;
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

      bufferDataU32[offset++] = texture.textureType;

      // paddings
      bufferDataF32[offset++] = texture.pad_0;
      bufferDataF32[offset++] = texture.pad_1;
      bufferDataF32[offset++] = texture.pad_2;
    }

    // log('Textures:', bufferData);
    return bufferData;
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
    const elementCount = 8;
    const primitiveSize = elementCount * 4;

    const bufferData = new ArrayBuffer(primitiveSize * this._gpuPrimitives.length);
    const bufferDataF32 = new Float32Array(bufferData);
    const bufferDataU32 = new Uint32Array(bufferData);

    let offset = 0;
    for (const primitiv of this._gpuPrimitives) {
      bufferDataF32[offset++] = primitiv.center[0];
      bufferDataF32[offset++] = primitiv.center[1];
      bufferDataF32[offset++] = primitiv.center[2];
      bufferDataF32[offset++] = primitiv.radius;

      bufferDataU32[offset++] = primitiv.primitiveType;
      bufferDataU32[offset++] = primitiv.materialIndex;

      bufferDataF32[offset++] = primitiv.pad_0;
      bufferDataF32[offset++] = primitiv.pad_1;
    }

    //log('Primitives:', bufferData);

    return bufferData;
  }
}
