#include "../ray.wgsl"
#include "../utils.wgsl"
#include "./hittable_base.wgsl"

fn hitSphere(
  sphere: Primitve,
  ray: ptr<function, Ray, read_write>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord, read_write>
) -> bool {
  var transformedRay = transformRay(ray, sphere.objectToWorld);

  let center       = sphere.center0.xyz;
  let oc           = transformedRay.origin - center;
  let a            = lengthSquared(transformedRay.direction);
  let half_b       = dot(oc, transformedRay.direction);
  let c            = lengthSquared(oc) - sphere.radius * sphere.radius;
  let discriminant = half_b * half_b - a * c;

  if(discriminant > 0.0) {
    let root = sqrt(discriminant);
    var temp = (-half_b - root) / a;
    if (temp < tMax && temp > tMin) {
      (*rec).t             = temp;
      (*rec).p             = rayAt(&transformedRay, (*rec).t);
      let outwardNormal = ((*rec).p - center) / sphere.radius;
      setFaceNormal(rec, &transformedRay, outwardNormal);
      let uv = getSphereUV(outwardNormal);
      (*rec).uv = uv;
      (*rec).materialIndex = sphere.materialIndex;
      transformRecord(rec, sphere.objectToWorld);
      return true;
    }

    temp = (-half_b + root) / a;
    if (temp < tMax && temp > tMin) {
      (*rec).t             = temp;
      (*rec).p             = rayAt(&transformedRay, (*rec).t);
      let outwardNormal = ((*rec).p - center) / sphere.radius;
      setFaceNormal(rec, &transformedRay, outwardNormal);
      let uv = getSphereUV(outwardNormal);
      (*rec).uv = uv;
      (*rec).materialIndex = sphere.materialIndex;
      transformRecord(rec, sphere.objectToWorld);
      return true;
    }
  }

  return false;
}