import material from './material';
import vec3 from './vec3';
import { hit_record } from './hittable';
import ray from './ray';

export default class lambertian extends material {
  private albedo: vec3;

  public constructor(color: vec3) {
    super();
    this.albedo = color;
  }

  public scatter(r_in: ray, rec: hit_record, attenuation: vec3, scattered: ray): boolean {
    const scatter_direction = vec3.addVec3(rec.normal, vec3.random_unit_vector());
    new ray(rec.p, scatter_direction).copyTo(scattered);
    this.albedo.copyTo(attenuation);
    return true;
  }
}
