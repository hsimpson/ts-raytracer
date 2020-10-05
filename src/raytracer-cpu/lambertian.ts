import Material from './material';
import { HitRecord, IWebGPUObject, WebGPUMaterialType } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';
import { Texture, SolidColor } from './texture';

@serializable
export default class LambertianMaterial extends Material implements IWebGPUObject {
  private _albedo: Texture;
  private static _gpuBuffer = [];
  private static _staticgpuObjectIndex = 0;
  private _gpuObjectIndex: number;

  public constructor(color?: Vec3) {
    super();
    this._gpuObjectIndex = LambertianMaterial._staticgpuObjectIndex++;
    if (color) {
      this._albedo = new SolidColor(color);
    }
    this.insertIntoBufferArray();
  }

  public insertIntoBufferArray(): void {
    const tex = (this._albedo as unknown) as IWebGPUObject;
    const texTypeId = tex?.gpuObjectTypeId ?? 0;
    const texIndex = tex?.gpuObjectIndex ?? 0;
    LambertianMaterial._gpuBuffer.push(texTypeId, texIndex, -1, -1);
  }

  public static resetGPUBuffer(): void {
    LambertianMaterial._gpuBuffer = [];
    LambertianMaterial._staticgpuObjectIndex = 0;
  }

  public set texture(texture: Texture) {
    this._albedo = texture;
    const tex = (this._albedo as unknown) as IWebGPUObject;
    const texTypeId = tex?.gpuObjectTypeId ?? 0;
    const texIndex = tex?.gpuObjectIndex ?? 0;

    const idx = this._gpuObjectIndex * 2;
    LambertianMaterial._gpuBuffer[idx] = texTypeId;
    LambertianMaterial._gpuBuffer[idx + 1] = texIndex;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, r_in.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    Vector.copyTo(col, attenuation);
    return true;
  }

  public get gpuObjectTypeId(): WebGPUMaterialType {
    return WebGPUMaterialType.Lambertian;
  }

  public get gpuObjectIndex(): number {
    return this._gpuObjectIndex;
  }

  public static get gpuBufferArray(): Float32Array {
    console.log('LambertianMaterial:', LambertianMaterial._gpuBuffer);
    return new Float32Array(LambertianMaterial._gpuBuffer);
  }
}
