import { Hittable, HitRecord } from './hittable';
import Ray from './ray';

export default class BaseObject implements Hittable {
  public hit(_r: Ray, _t_min: number, _t_max: number, _rec: HitRecord): boolean {
    return false;
  }
}
