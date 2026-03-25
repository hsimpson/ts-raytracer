import { Material } from '../material';
import { AABB } from './aabb';
import { HitRecord } from './hitrecord';
import { Ray } from './ray';
import { Transform } from './transform';
// import { logMatrix } from '../util';

export interface Hitable {
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  boundingBox(t0: number, t1: number): AABB;
  name: string;
  transform: Transform;
  material?: Material;
}

export abstract class HitableBase implements Hitable {
  public name = '';
  public readonly transform: Transform = new Transform();

  public abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
  public abstract boundingBox(t0: number, t1: number): AABB;
}

export abstract class ObjectHitable extends HitableBase {
  public material: Material;

  public constructor(material: Material) {
    super();
    this.material = material;
  }
}
