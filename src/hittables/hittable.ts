import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { Transform } from '../raytracer-cpu/transform';
import { AABB } from './aabb';
// import { logMatrix } from '../util';

export abstract class Hittable {
  public abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  public abstract boundingBox(t0: number, t1: number): AABB;
  public material: Material;
  public name = '';
  public readonly transform: Transform = new Transform();
}
