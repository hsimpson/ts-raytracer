import type { Vec3 } from '../vec3';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import type { Texture } from '../raytracer-cpu/texture';

export abstract class Material {
  public emitted(_u: number, _v: number, _p: Vec3): Vec3 {
    return [0, 0, 0];
  }
  public abstract scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean;

  public get texture(): Texture | undefined {
    return undefined;
  }
}
