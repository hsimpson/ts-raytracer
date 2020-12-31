import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';

@serializable
export class NormalMaterial extends Material {
  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    let col = rec.normal;
    col = Vector.addScalar(col, 1);
    col = Vector.multScalarVec3(col, 0.5);
    col = Vector.unitVector(col);

    Vector.copyTo(col, attenuation);
    return true;
  }
}
