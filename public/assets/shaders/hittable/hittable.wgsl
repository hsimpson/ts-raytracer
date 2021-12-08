
let HITTABLETYPE_SPHERE = 0u;
let HITTABLETYPE_MOVINGSPHERE = 1u;
let HITTABLETYPE_XYRECT = 2u;
let HITTABLETYPE_XZRECT = 3u;
let HITTABLETYPE_YZRECT = 4u;
let HITTABLETYPE_CONSTANTMEDIUM = 5u;
let HITTABLETYPE_TRIANGLE = 6u;

#include "../ray.wgsl"
#include "./hittable_base.wgsl"
#include "./sphere.wgsl"
#include "./movingsphere.wgsl"
#include "./rect.wgsl"
#include "./triangle.wgsl"

// FIXME: case identifiers

fn hitPrimitve(
  primitve: Primitve,
  ray: ptr<function, Ray, read_write>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord, read_write>
) -> bool {
  let primitiveType = primitve.primitiveType;
  var hitted: bool = false;

  if(primitiveType == HITTABLETYPE_SPHERE) {
    hitted = hitSphere(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_MOVINGSPHERE) {
    hitted = hitMovingSphere(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_XYRECT) {
    hitted = hitXYRect(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_XZRECT) {
    hitted = hitXZRect(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_YZRECT) {
    hitted = hitYZRect(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_CONSTANTMEDIUM) {
    // hitted = hitSphere(primitve, ray, tMin, tMax, rec);
  } elseif(primitiveType == HITTABLETYPE_TRIANGLE) {
    hitted = hitTriangle(primitve, ray, tMin, tMax, rec);
  } else {
    hitted = false;
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
