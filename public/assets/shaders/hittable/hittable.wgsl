
let HITTABLETYPE_SPHERE = 0u;
let HITTABLETYPE_MOVINGSPHERE = 1u;
let HITTABLETYPE_XYRECT = 2u;
let HITTABLETYPE_XZRECT = 3u;
let HITTABLETYPE_YZRECT = 4u;
// let HITTABLETYPE_CONSTANTMEDIUM = 5u;
let HITTABLETYPE_TRIANGLE = 6u;

#include "./hittable_base.wgsl"

fn hitPrimitve(
  primitve: Primitve,
  ray: ptr<function, Ray, read_write>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord, read_write>
) -> bool {
  let primitiveType = primitve.primitiveType;
  var hitted: bool = false;

  switch (primitiveType) {
    case 0u: {
      //hitted = hitSphere(primitve, ray, tMin, tMax, rec);
      hitted = true;
      break;
    }
    default: {
      break;
    }
  }

  return hitted;
}

fn hittableListHit(
  ray: ptr<function, Ray, read_write>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord, read_write>
) -> bool {
  var tempRec: HitRecord;
  var hitAnything = false;
  var closestSoFar = tMax;

  let primitveCount = arrayLength(&(primitivesBuffer.primitives));
  for(var i = 0u; i < primitveCount; i = i + 1u) {
    if(hitPrimitve(primitivesBuffer.primitives[i], ray, tMin, closestSoFar, &tempRec)) {
      if(tempRec.t <= closestSoFar) {
        hitAnything = true;
        closestSoFar = tempRec.t;
        *rec = tempRec;
      }
    }
  }

  return hitAnything;
}
