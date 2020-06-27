import material from './material';
import vec3 from './vec3';
import ray from './ray';
import { hit_record } from './hittable';

export default class metal extends material {
  private albedo: vec3;
  private roughness: number;

  public constructor(color: vec3, roughness: number) {
    super();
    this.albedo = color;
    this.roughness = roughness;
  }

  public scatter(r_in: ray, rec: hit_record, attenuation: vec3, scattered: ray): boolean {
    const reflect = vec3.reflect(vec3.unit_vector(r_in.direction), rec.normal);

    new ray(rec.p, vec3.addVec3(reflect, vec3.multScalarVec3(vec3.random_in_unit_sphere(), this.roughness))).copyTo(
      scattered
    );
    this.albedo.copyTo(attenuation);
    return vec3.dot(scattered.direction, rec.normal) > 0;
  }
}
