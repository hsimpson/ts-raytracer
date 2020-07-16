import { Material } from './material';
import Ray from './ray';
import Vec3 from '../vec3';
import { HitRecord } from './hittable';

export default class BaseMaterial implements Material {
  public scatter(_r_in: Ray, _rec: HitRecord, _attenuation: Vec3, _scattered: Ray): boolean {
    return false;
  }
}
