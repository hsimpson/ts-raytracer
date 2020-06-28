import { Hittable, HitRecord } from './hittable';
import Ray from './ray';

export class HittableList extends Hittable {
  private objects: Hittable[] = [];

  public constructor(object?: Hittable) {
    super();
    if (object) {
      this.add(object);
    }
  }

  public clear(): void {
    this.objects.length = 0;
  }

  public add(object: Hittable): void {
    this.objects.push(object);
  }

  public hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    const temp_rec = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (const object of this.objects) {
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;

        temp_rec.copyTo(rec);
      }
    }

    return hit_anything;
  }
}
