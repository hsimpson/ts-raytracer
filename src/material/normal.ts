import { vec3, Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import { randomUnitVector } from '../util';
import { Material } from './material';

export class NormalMaterial extends Material {
  public corrected = false;

  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const col = rec.normal;

    if (this.corrected) {
      vec3.add(col, vec3.fromValues(1, 1, 1), col);
      vec3.scale(col, 0.5, col);
      vec3.normalize(col, col);
    }

    vec3.copy(attenuation, col);
    return true;
  }
}
