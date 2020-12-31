import { serializable } from './serializing';
import { HitRecord } from './raytracer-cpu/hitrecord';
import { Ray } from './raytracer-cpu/ray';
import { Triangle } from './triangle';
import { Transform } from './raytracer-cpu/transform';

@serializable
export class TriangleMesh {
  private _triangles: Triangle[] = [];
  public readonly transform: Transform = new Transform();

  public add(triangle: Triangle): void {
    this._triangles.push(triangle);
  }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const tempRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;

    const transformedRay = this.transform.transformRay(ray);

    for (const triangle of this._triangles) {
      if (triangle.hit(transformedRay, tMin, closestSoFar, tempRecord)) {
        hitAnything = true;
        closestSoFar = tempRecord.t;

        tempRecord.copyTo(rec);
      }
    }

    if (hitAnything) {
      this.transform.transformRecord(transformedRay, rec);
    }

    return hitAnything;
  }
}
