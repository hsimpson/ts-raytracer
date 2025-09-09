import { vec3 } from 'gl-matrix';
import { HitRecord } from '../hittables/hitrecord';
import { Ray } from '../hittables/ray';
import { SolidColor, Texture } from '../textures';
import { Material } from './material';

export class DiffuseLight extends Material {
  private readonly _emit: Texture;

  public constructor(color: vec3) {
    super();
    this._emit = new SolidColor(color);
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
