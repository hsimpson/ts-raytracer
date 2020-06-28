import Ray from './ray';
import Vec3 from './vec3';
import { HitRecord } from './hittable';

export default abstract class Material {
  public abstract scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean;
}
