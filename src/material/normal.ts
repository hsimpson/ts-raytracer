import { vec3 } from 'gl-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import { randomUnitVector } from '../util';
import { Material } from './material';

export class NormalMaterial extends Material {
  public corrected = false;

  public scatter(ray: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(vec3.create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const col = rec.normal;

    if (this.corrected) {
      vec3.add(col, col, vec3.fromValues(1, 1, 1));
      vec3.scale(col, col, 0.5);
      vec3.normalize(col, col);
    }

    vec3.copy(attenuation, col);
    return true;
  }
}
