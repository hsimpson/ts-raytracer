import { AABB } from './aabb';
import { HitRecord } from './hitrecord';
import { Material } from './material';
import { Ray } from './ray';
import { Transform } from './transform';
// import { logMatrix } from '../util';

export abstract class Hittable {
  public abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  public abstract boundingBox(t0: number, t1: number, outputBox: AABB): boolean;
  public material: Material;
  public name = '';
  public readonly transform: Transform = new Transform();
}
