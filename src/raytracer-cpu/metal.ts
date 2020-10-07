import Material from './material';
import { HitRecord, IWebGPUObject, WebGPUMaterialType } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';

@serializable
export default class MetalMaterial extends Material implements IWebGPUObject {
  private _albedo: Vec3;
  private _roughness: number;
  private static _gpuBuffer = [];
  private static _staticgpuObjectIndex = 0;
  private _gpuObjectIndex: number;

  public constructor(color: Vec3, roughness: number) {
    super();
    this._albedo = color;
    this._roughness = roughness;
    this._gpuObjectIndex = MetalMaterial._staticgpuObjectIndex++;

    this.insertIntoBufferArray();
  }

  public insertIntoBufferArray(): void {
    MetalMaterial._gpuBuffer.push(...this._albedo, this._roughness);
  }

  public static resetGPUBuffer(): void {
    MetalMaterial._gpuBuffer = [];
    MetalMaterial._staticgpuObjectIndex = 0;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const reflect = Vector.reflect(Vector.unitVector(r_in.direction), rec.normal);

    new Ray(
      rec.p,
      Vector.addVec3(reflect, Vector.multScalarVec3(Vector.randomInUnitSphere(), this._roughness)),
      r_in.time
    ).copyTo(scattered);
    Vector.copyTo(this._albedo, attenuation);
    return Vector.dot(scattered.direction, rec.normal) > 0;
  }

  public get gpuObjectTypeId(): WebGPUMaterialType {
    return WebGPUMaterialType.Metal;
  }

  public get gpuObjectIndex(): number {
    return this._gpuObjectIndex;
  }

  public static get gpuBufferArray(): Float32Array {
    console.log('MetalMaterial:', MetalMaterial._gpuBuffer);
    return new Float32Array(MetalMaterial._gpuBuffer);
  }
}
