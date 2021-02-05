import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { SolidColor, Texture } from '../raytracer-cpu/texture';
import { serializable } from '../serializing';
import { Material } from './material';

@serializable
export class DiffuseLight extends Material {
  private _emit: Texture;

  public constructor(color?: vec3) {
    super();
    if (color) {
      this._emit = new SolidColor(color);
    }
  }

  public get texture(): Texture {
    return this._emit;
  }

  public scatter(_r_in: Ray, _rec: HitRecord, _attenuation: vec3, _scattered: Ray): boolean {
    return false;
  }

  public emitted(u: number, v: number, p: vec3): vec3 {
    return this._emit.value(u, v, p);
  }
}
