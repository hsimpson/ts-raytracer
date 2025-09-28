import { vec3, Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import type { Texture } from '../textures';

export abstract class Material {
  public emitted(_u: number, _v: number, _p: Vec3): Vec3 {
    return vec3.zero();
  }
  public abstract scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean;

  public get texture(): Texture | undefined {
    return undefined;
  }
}
