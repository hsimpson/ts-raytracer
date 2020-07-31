import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import Vec3 from '../vec3';
import { serializable } from '../serializing';
import { Texture, SolidColor } from './texture';

@serializable
export default class LambertianMaterial extends Material {
  private albedo: Texture;

  public constructor(color?: Vec3) {
    super();
    if (color) {
      this.albedo = new SolidColor(color);
    }
  }

  public set texture(texture: Texture) {
    this.albedo = texture;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vec3.addVec3(rec.normal, Vec3.randomUnitVector());
    new Ray(rec.p, scatter_direction, r_in.time).copyTo(scattered);
    const col = this.albedo.value(rec.u, rec.v, rec.p);
    col.copyTo(attenuation);
    return true;
  }
}
