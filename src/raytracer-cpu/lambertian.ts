import Material from './material';
import { HitRecord } from './hittable';
import Ray from './ray';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { serializable } from '../serializing';
import { Texture, SolidColor } from './texture';

@serializable
export default class LambertianMaterial extends Material {
  private _albedo: Texture;

  public constructor(color?: Vec3) {
    super();
    if (color) {
      this._albedo = new SolidColor(color);
    }
  }

  public set texture(texture: Texture) {
    this._albedo = texture;
  }

  public scatter(r_in: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, r_in.time).copyTo(scattered);
    const col = this._albedo.value(rec.u, rec.v, rec.p);
    Vector.copyTo(col, attenuation);
    return true;
  }
}
