import { Vec3 } from 'wgpu-matrix';
import { HitRecord } from '../hitables/hitrecord';
import { Ray } from '../hitables/ray';
import { SolidColor, Texture } from '../textures';
import { Material } from './material';

export class DiffuseLight extends Material {
  private readonly _emit: Texture;

  public constructor(color: Vec3) {
    super();
    this._emit = new SolidColor(color);
  }

  public override get texture(): Texture {
    return this._emit;
  }

  public override scatter(_r_in: Ray, _rec: HitRecord, _attenuation: Vec3, _scattered: Ray): boolean {
    return false;
  }

  public override emitted(u: number, v: number, p: Vec3): Vec3 {
    return this._emit.value(u, v, p);
  }
}
