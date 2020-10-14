import { HittableList } from '../raytracer-cpu/hittablelist';
import Material from '../raytracer-cpu/material';
import LambertianMaterial from '../raytracer-cpu/lambertian';
import MetalMaterial from '../raytracer-cpu/metal';
import { SolidColor } from '../raytracer-cpu/texture';
import type { Vec3 } from '../vec3';
import { Hittable } from '../raytracer-cpu/hittable';
import { Sphere } from '../raytracer-cpu/sphere';

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

// export enum WebGPUTextureType {
//   Solid = 0,
//   Checker = 1,
//   Noise = 2,
//   Image = 3,
// }

interface WebGPUMaterial {
  color: [...rgb: Vec3, a: number]; // TODO: use vec4
  roughness: number;
  materialType: WebGPUMaterialType;

  // padding
  pad_0: number;
  pad_1: number;
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

export class RaytracingBuffers {
  private _gpuMaterials: WebGPUMaterial[] = [];
  private _gpuPrimitives: WebGPUPrimitive[] = [];

  public constructor(world: HittableList) {
    this.traverseHittables(world);
  }

  private traverseHittables(list: HittableList): void {
    for (const object of list.objects) {
      this.addPrimitive(object);
    }
  }

  private addMaterial(mat: Material): number {
    const idx = this._gpuMaterials.length;
    let gpuMat: WebGPUMaterial;

    if (mat instanceof LambertianMaterial) {
      const tex = mat.texture as SolidColor;
      gpuMat = {
        color: [...tex.color, 1.0],
        roughness: 0,
        materialType: WebGPUMaterialType.Lambertian,

        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
      };
    } else if (mat instanceof MetalMaterial) {
      gpuMat = {
        color: [...mat.color, 1],
        roughness: mat.roughness,
        materialType: WebGPUMaterialType.Metal,

        pad_0: PADDING_VALUE,
        pad_1: PADDING_VALUE,
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

  public materialBuffer(): Float32Array {
    const arr = [];

    for (const mat of this._gpuMaterials) {
      arr.push(...mat.color);
      arr.push(mat.roughness);
      arr.push(mat.materialType);

      arr.push(mat.pad_0);
      arr.push(mat.pad_1);
    }

    console.log('Materials:', arr);
    return new Float32Array(arr);
  }

  public primitiveBuffer(): Float32Array {
    const arr = [];

    for (const primitiv of this._gpuPrimitives) {
      arr.push(...primitiv.center);
      arr.push(primitiv.radius);
      arr.push(primitiv.primitiveType);
      arr.push(primitiv.materialIndex);

      arr.push(primitiv.pad_0);
      arr.push(primitiv.pad_1);
    }

    console.log('Primitives:', arr);
    return new Float32Array(arr);
  }
}
