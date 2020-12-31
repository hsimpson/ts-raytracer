import { serializable } from './serializing';
import { HitRecord } from './raytracer-cpu/hitrecord';
import { Ray } from './raytracer-cpu/ray';
import { Triangle } from './triangle';

@serializable
export class TriangleMesh {
  private _triangles: Triangle[] = [];

  public add(triangle: Triangle): void {
    this._triangles.push(triangle);
  }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const tempRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;

    for (const triangle of this._triangles) {
      if (triangle.hit(ray, tMin, closestSoFar, tempRecord)) {
        hitAnything = true;
        closestSoFar = tempRecord.t;

        tempRecord.copyTo(rec);
      }
    }

    return hitAnything;
  }
}
