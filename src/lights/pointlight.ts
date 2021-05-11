import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { serializable } from '../serializing';
import { Light } from './light';

@serializable
export class PointLight extends Light {
  public sampleLi(hitrecord: HitRecord): { wi: vec3; pdf: number; intensity: vec3 } {
    const wi = vec3.subtract(vec3.create(), this.postion, hitrecord.p);
    vec3.normalize(wi, wi);
    const pdf = 1.0;

    const intensity = this.intensity / vec3.squaredDistance(this.postion, hitrecord.p);

    return { wi, pdf, intensity };
  }
}
