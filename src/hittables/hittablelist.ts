import { serializable } from '../serializing';
import { AABB } from '../raytracer-cpu/aabb';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Hittable } from './hittable';
import { Ray } from '../raytracer-cpu/ray';

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
        hitAnything = true;
        closestSoFar = tempRecord.t;

        tempRecord.copyTo(rec);
      }
    }

    return hitAnything;
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