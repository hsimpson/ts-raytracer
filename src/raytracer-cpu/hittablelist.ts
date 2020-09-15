import { HitRecord, Hittable } from './hittable';
import Ray from './ray';
import AABB from './aabb';
import { serializable } from '../serializing';

@serializable
export class HittableList extends Hittable {
  private _objects: Hittable[] = [];

  public constructor(object?: Hittable) {
    super();
    if (object) {
      this.add(object);
    }
  }

  public get objects(): Hittable[] {
    return this._objects;
  }

  public clear(): void {
    this._objects.length = 0;
  }

  public add(object: Hittable): void {
    this._objects.push(object);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const temp_rec = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (const object of this._objects) {
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;

        temp_rec.copyTo(rec);
      }
    }

    return hit_anything;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    if (this._objects.length === 0) {
      return false;
    }
    const tempBox: AABB = new AABB();
    let firstBox = true;
    for (const object of this._objects) {
      if (!object.boundingBox(t0, t1, tempBox)) {
        return false;
      }

      if (firstBox) {
        tempBox.copyTo(outputBox);
      } else {
        AABB.surroundingBox(outputBox, tempBox).copyTo(outputBox);
      }
      firstBox = false;
    }
    return true;
  }
}
