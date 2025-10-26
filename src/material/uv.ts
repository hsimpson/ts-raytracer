import { vec3, Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hitables/hitrecord';
import { Ray } from '../hitables/ray';
import { randomUnitVector } from '../util';
import { Material } from './material';

export class UVMaterial extends Material {
  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const col = vec3.fromValues(rec.u, rec.v, 0);
    vec3.copy(attenuation, col);
    return true;
  }
}
