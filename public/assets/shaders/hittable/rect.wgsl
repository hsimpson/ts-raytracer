#include "../ray.wgsl"
#include "../utils.wgsl"
#include "./hittable_base.wgsl"

fn hitXYRect(
  rect: Primitve,
  ray: ptr<function, Ray>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord>
) -> bool {
  var transformedRay = transformRay(ray, rect.inverseMatrix, rect.inverseRotation);

  let t = (rect.k - transformedRay.origin.z) / transformedRay.direction.z;
  if (t < tMin || t > tMax) {
    return false;
  }

  let x = transformedRay.origin.x + t * transformedRay.direction.x;
  let y = transformedRay.origin.y + t * transformedRay.direction.y;

  if (x < rect.bounds.x || x > rect.bounds.y || y < rect.bounds.z || y > rect.bounds.w) {
    return false;
  }

  (*rec).uv.x = (x - rect.bounds.x) / (rect.bounds.y - rect.bounds.x);
  (*rec).uv.y = (y - rect.bounds.z) / (rect.bounds.w - rect.bounds.z);
  (*rec).t    = t;

  let outwardNormal = vec3<f32>(0.0, 0.0, 1.0);
  setFaceNormal(rec, &transformedRay, outwardNormal);
  (*rec).materialIndex = rect.materialIndex;
  (*rec).p             = rayAt(&transformedRay, (*rec).t);
  transformRecord(rec, rect.objectToWorld);

  return true;
}

fn hitXZRect(
  rect: Primitve,
  ray: ptr<function, Ray>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord>
) -> bool {
  var transformedRay = transformRay(ray, rect.inverseMatrix, rect.inverseRotation);

  let t = (rect.k - transformedRay.origin.y) / transformedRay.direction.y;
  if (t < tMin || t > tMax) {
    return false;
  }

  let x = transformedRay.origin.x + t * transformedRay.direction.x;
  let z = transformedRay.origin.z + t * transformedRay.direction.z;

  if (x < rect.bounds.x || x > rect.bounds.y || z < rect.bounds.z || z > rect.bounds.w) {
    return false;
  }

  (*rec).uv.x = (x - rect.bounds.x) / (rect.bounds.y - rect.bounds.x);
  (*rec).uv.y = (z - rect.bounds.z) / (rect.bounds.w - rect.bounds.z);
  (*rec).t    = t;

  let outwardNormal = vec3<f32>(0.0, 1.0, 0.0);
  setFaceNormal(rec, &transformedRay, outwardNormal);
  (*rec).materialIndex = rect.materialIndex;
  (*rec).p             = rayAt(&transformedRay, (*rec).t);
  transformRecord(rec, rect.objectToWorld);

  return true;
}

fn hitYZRect(
  rect: Primitve,
  ray: ptr<function, Ray>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord>
) -> bool {
  var transformedRay = transformRay(ray, rect.inverseMatrix, rect.inverseRotation);

  let t = (rect.k - transformedRay.origin.x) / transformedRay.direction.x;
  if (t < tMin || t > tMax) {
    return false;
  }

  let y = transformedRay.origin.y + t * transformedRay.direction.y;
  let z = transformedRay.origin.z + t * transformedRay.direction.z;

  if (y < rect.bounds.x || y > rect.bounds.y || z < rect.bounds.z || z > rect.bounds.w) {
    return false;
  }

  (*rec).uv.x = (y - rect.bounds.x) / (rect.bounds.y - rect.bounds.x);
  (*rec).uv.y = (z - rect.bounds.z) / (rect.bounds.w - rect.bounds.z);
  (*rec).t    = t;

  let outwardNormal = vec3<f32>(1.0, 0.0, 0.0);
  setFaceNormal(rec, &transformedRay, outwardNormal);
  (*rec).materialIndex = rect.materialIndex;
  (*rec).p             = rayAt(&transformedRay, (*rec).t);
  transformRecord(rec, rect.objectToWorld);

  return true;
}
