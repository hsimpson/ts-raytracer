import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Material } from './material';
import { Ray } from '../raytracer-cpu/ray';

@serializable
export class UVMaterial extends Material {
  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const col: Vec3 = [rec.u, rec.v, 0];
    Vector.copyTo(col, attenuation);
    return true;
  }
}
