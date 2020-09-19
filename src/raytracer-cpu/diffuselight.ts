import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import { HitRecord } from './hittable';
import Material from './material';
import Ray from './ray';
import { SolidColor, Texture } from './texture';

@serializable
export default class DiffuseLight extends Material {
  private _emit: Texture;

  public constructor(color?: Vec3) {
    super();
    if (color) {
      this._emit = new SolidColor(color);
    }
  }

  public scatter(_r_in: Ray, _rec: HitRecord, _attenuation: Vec3, _scattered: Ray): boolean {
    return false;
  }

  public emitted(u: number, v: number, p: Vec3): Vec3 {
    return this._emit.value(u, v, p);
  }
}
