import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { serializable } from '../serializing';
import { randomInt, sortArrayRange } from '../util';
import { AABB } from './aabb';
import { Hittable } from './hittable';
import { HittableList } from './hittablelist';

let _id = 0;
let _level = 0;

@serializable
export class BVHNode extends Hittable {
  private bbox = new AABB();
  private left: Hittable;
  private right: Hittable;
  public readonly id = _id;
  public level: number;

  public constructor() {
    super();
    _id++;
  }

  public static createFromHitableList(list: HittableList, time0: number, time1: number): BVHNode {
    _id = 0;
    _level = 0;
    console.log('BVH starting...');
    const startTime = window.performance.now();
    const node = new BVHNode();
    node.level = _level;

    const flatList = new HittableList();
    const fillFlatList = (list: HittableList): void => {
      for (const object of list.objects) {
        if (object instanceof HittableList) {
          fillFlatList(object);
        } else {
          flatList.add(object);
        }
      }
    };
    fillFlatList(list);
    console.log(`BVH objects: ${flatList.objects.length}`);

    node.init(flatList.objects, 0, flatList.objects.length, time0, time1);

    console.log(`BVH finish: ${(window.performance.now() - startTime).toFixed(2)}`);
    console.log(`BVH nodes: ${_id}`);
    console.log(`BVH levels: ${_level}`);
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
      // sortArrayRange(objects, start, end, comparator);
      const mid = start + Math.floor(objectSpan / 2);
      const nextLevel = ++_level;
      this.left = BVHNode.createFromObjects(objects, start, mid, time0, time1);
      this.right = BVHNode.createFromObjects(objects, mid, end, time0, time1);
      (this.left as BVHNode).level = nextLevel;
      (this.right as BVHNode).level = nextLevel;
    }

    const boxLeft = this.left.boundingBox(time0, time1);
    const boxRight = this.right.boundingBox(time0, time1);

    this.bbox = AABB.surroundingBox(boxLeft, boxRight);

    // const leftIsBVHNode = this.left instanceof BVHNode ? `BVHNode-${this.left.id}` : '';
    // const rightIsBVHNode = this.right instanceof BVHNode ? `BVHNode-${this.right.id}` : '';

    // console.log(`BVHNode-${this.id}: ${this.box.logBox()}`);
    // console.log(`  Left(${leftIsBVHNode}): ${boxLeft.logBox()}`);
    // console.log(`  Right(${rightIsBVHNode}): ${boxRight.logBox()}`);
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
    if (!this.bbox.hit(ray, tMin, tMax)) {
      return false;
    }

    const leftHit = this.left.hit(ray, tMin, tMax, rec);
    const rightHit = this.right.hit(ray, tMin, leftHit ? rec.t : tMax, rec);

    return leftHit || rightHit;
  }

  public boundingBox(_t0: number, _t1: number): AABB {
    return this.bbox;
  }
}

function boxCompare(a: Hittable, b: Hittable, axis: number): number {
  const boxA = a.boundingBox(0, 0);
  const boxB = b.boundingBox(0, 0);

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
