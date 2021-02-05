import { serializable } from '../serializing';
import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Material } from './material';
import { Ray } from '../raytracer-cpu/ray';
import { randomUnitVector } from '../util';

@serializable
export class UVMaterial extends Material {
  public scatter(ray: Ray, rec: HitRecord, attenuation: vec3, scattered: Ray): boolean {
    const scatter_direction = vec3.add(vec3.create(), rec.normal, randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const col: vec3 = vec3.fromValues(rec.u, rec.v, 0);
    vec3.copy(attenuation, col);
    return true;
  }
}
