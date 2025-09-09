import { vec3 } from 'gl-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import type { Texture } from '../textures';

export abstract class Material {
  public emitted(_u: number, _v: number, _p: vec3): vec3 {
    return vec3.create();
  }
  public abstract scatter(r_in: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean;

  public get texture(): Texture | undefined {
    return undefined;
  }
}
