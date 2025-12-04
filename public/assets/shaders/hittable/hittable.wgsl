
const HITABLETYPE_SPHERE = 0u;
const HITABLETYPE_MOVINGSPHERE = 1u;
const HITABLETYPE_XYRECT = 2u;
const HITABLETYPE_XZRECT = 3u;
const HITABLETYPE_YZRECT = 4u;
const HITABLETYPE_CONSTANTMEDIUM = 5u;
const HITABLETYPE_TRIANGLE = 6u;

#include "../ray.wgsl"
#include "./hittable_base.wgsl"
#include "./sphere.wgsl"
#include "./movingsphere.wgsl"
#include "./rect.wgsl"
#include "./triangle.wgsl"

// FIXME: case identifiers

fn hitPrimitive(
  primitive: Primitive,
  ray: ptr<function, Ray>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord>
) -> bool {
  let primitiveType = primitive.primitiveType;
  var hited: bool = false;

  if(primitiveType == HITABLETYPE_SPHERE) {
    hited = hitSphere(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_MOVINGSPHERE) {
    hited = hitMovingSphere(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_XYRECT) {
    hited = hitXYRect(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_XZRECT) {
    hited = hitXZRect(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_YZRECT) {
    hited = hitYZRect(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_CONSTANTMEDIUM) {
    // hited = hitSphere(primitive, ray, tMin, tMax, rec);
  } else if(primitiveType == HITABLETYPE_TRIANGLE) {
    hited = hitTriangle(primitive, ray, tMin, tMax, rec);
  } else {
    hited = false;
  }

  return hited;
}

fn hittableListHit(
  ray: ptr<function, Ray>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord>
) -> bool {
  var tempRec: HitRecord;
  var hitAnything = false;
  var closestSoFar = tMax;

  let primitiveCount = arrayLength(&(primitivesBuffer.primitives));
  for(var i = 0u; i < primitiveCount; i = i + 1u) {
    if(hitPrimitive(primitivesBuffer.primitives[i], ray, tMin, closestSoFar, &tempRec)) {
      if(tempRec.t <= closestSoFar) {
        hitAnything = true;
        closestSoFar = tempRec.t;
        *rec = tempRec;
      }
    }
  }

  return hitAnything;
}
