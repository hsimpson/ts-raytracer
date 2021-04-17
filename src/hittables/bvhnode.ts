import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { randomInt, sortArrayRange } from '../util';
import { AABB } from './aabb';
import { Hittable } from './hittable';
import { HittableList } from './hittablelist';

let _id = 0;

@serializable
export class BVHNode extends Hittable {
  private box = new AABB();
  private left: Hittable;
  private right: Hittable;
  public readonly id = _id;

  public constructor() {
    super();
    //console.log(`BVH-Node ${this.id}`);
    _id++;
  }

  public static createFromHitableList(list: HittableList, time0: number, time1: number): BVHNode {
    const node = new BVHNode();
    node.init(list.objects, 0, list.objects.length, time0, time1);
    return node;
  }

  public static createFromObjects(
    objects: Hittable[],
    start: number,
    end: number,
    time0: number,
    time1: number
  ): BVHNode {
    const node = new BVHNode();
    node.init(objects, start, end, time0, time1);
    return node;
  }

  private init(objects: Hittable[], start: number, end: number, time0: number, time1: number): void {
    const axis = randomInt(0, 2);
    const comparator = axis === 0 ? boxXCompare : axis === 1 ? boxYCompare : boxZCompare;

    const objectSpan = end - start;

    if (objectSpan === 1) {
      this.left = this.right = objects[start];
    } else if (objectSpan === 2) {
      if (comparator(objects[start], objects[start + 1]) === -1) {
        this.left = objects[start];
        this.right = objects[start + 1];
      } else {
        this.left = objects[start + 1];
        this.right = objects[start];
      }
    } else {
      sortArrayRange(objects, start, end, comparator);
      const mid = start + Math.floor(objectSpan / 2);
      this.left = BVHNode.createFromObjects(objects, start, mid, time0, time1);
      this.right = BVHNode.createFromObjects(objects, mid, end, time0, time1);
    }

    const boxLeft = new AABB();
    const boxRight = new AABB();

    if (!this.left.boundingBox(time0, time1, boxLeft) || !this.right.boundingBox(time0, time1, boxRight)) {
      console.error('No bounding box in bvh_node constructor.');
    }
    this.box = AABB.surroundingBox(boxLeft, boxRight);

    const leftIsBVHNode = this.left instanceof BVHNode ? `BVHNode-${this.left.id}` : '';
    const rightIsBVHNode = this.right instanceof BVHNode ? `BVHNode-${this.right.id}` : '';

    console.log(`BVHNode-${this.id}: ${this.box.logBox()}`);
    console.log(`  Left(${leftIsBVHNode}): ${boxLeft.logBox()}`);
    console.log(`  Right(${rightIsBVHNode}): ${boxRight.logBox()}`);
  }

  // public hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
  //   //console.time(`BVH-hit #${this.id}`);
  //   if (!this.box.hit(r, tMin, tMax)) {
  //     return false;
  //     //console.timeEnd(`BVH-hit #${this.id}`);
  //   }

  //   const hitLeft = this.left.hit(r, tMin, tMax, rec);
  //   const hitRight = this.right.hit(r, tMin, hitLeft ? rec.t : tMax, rec);

  //   //console.timeEnd(`BVH-hit #${this.id}`);
  //   return hitLeft || hitRight;
  // }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    if (!this.box.hit(ray, tMin, tMax)) {
      return false;
    }

    const leftHit = this.left.hit(ray, tMin, tMax, rec);
    const rightHit = this.right.hit(ray, tMin, leftHit ? rec.t : tMax, rec);

    return leftHit || rightHit;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    this.box.copyTo(outputBox);
    return true;
  }
}

function boxCompare(a: Hittable, b: Hittable, axis: number): number {
  const boxA = new AABB();
  const boxB = new AABB();

  if (!a.boundingBox(0, 0, boxA) || !b.boundingBox(0, 0, boxB)) {
    console.error('No bounding box in bvh_node constructor.');
  }

  return boxA.min[axis] < boxB.min[axis] ? -1 : 1;
}

function boxXCompare(a: Hittable, b: Hittable): number {
  return boxCompare(a, b, 0);
}

function boxYCompare(a: Hittable, b: Hittable): number {
  return boxCompare(a, b, 1);
}

function boxZCompare(a: Hittable, b: Hittable): number {
  return boxCompare(a, b, 2);
}
