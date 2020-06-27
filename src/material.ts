import ray from './ray';
import vec3 from './vec3';
import { hit_record } from './hittable';

export default abstract class material {
  public abstract scatter(r_in: ray, rec: hit_record, attenuation: vec3, scattered: ray): boolean;
}
