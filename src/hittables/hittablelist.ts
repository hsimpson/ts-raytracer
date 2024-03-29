import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { AABB } from './aabb';
import { Hittable } from './hittable';

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

  // public clear(): void {
  //   this._objects.length = 0;
  // }

  public add(object: Hittable): void {
    this._objects.push(object);
  }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const tempRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;

    for (const object of this._objects) {
      if (object.hit(ray, tMin, closestSoFar, tempRecord)) {
        if (tempRecord.t <= closestSoFar) {
          hitAnything = true;
          closestSoFar = tempRecord.t;

          tempRecord.copyTo(rec);
        }
      }
    }

    return hitAnything;
  }

  public boundingBox(t0: number, t1: number): AABB {
    let bbox: AABB = new AABB();
    for (const object of this._objects) {
      bbox = AABB.surroundingBox(bbox, object.boundingBox(t0, t1));
    }
    return bbox;
  }
}
