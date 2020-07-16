import Ray from './ray';
import Vec3 from '../vec3';
import { HitRecord } from './hittable';

export interface Material {
  scatter: (r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray) => boolean;
}
