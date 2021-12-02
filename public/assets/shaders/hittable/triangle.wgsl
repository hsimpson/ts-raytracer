#include "../ray.wgsl"
#include "../utils.wgsl"
#include "./hittable_base.wgsl"

let EPSILON = 0.000001;
let TEST_CULL = true;

fn hitTriangle(
  tri: Primitve,
  ray: ptr<function, Ray, read_write>,
  tMin: f32,
  tMax: f32,
  rec: ptr<function, HitRecord, read_write>
) -> bool {
  let v0 = tri.v0.xyz;
  let v1 = tri.v1.xyz;
  let v2 = tri.v2.xyz;

  let n0 = tri.n0.xyz;
  let n1 = tri.n1.xyz;
  let n2 = tri.n2.xyz;

  // find vectors for two edges sharing vert
  let edge1 = v1 - v0;
  let edge2 = v2 - v0;

  // begin calculating determinant - also used to calculate U parameter
  let pvec = cross((*ray).direction, edge2);

  // if determinant is near zero, ray lies in plane of triangle
  let det = dot(edge1, pvec);
  let invDet = 1.0 / det;

  var t: f32;
  var u: f32;
  var v: f32;


  if(TEST_CULL) {

    if (det < EPSILON) {
      return false;
    }

    // calculate distance from vert0 to ray origin
    let tvec = (*ray).origin - v0;

    // calculate U parameter and test bounds
    u = dot(tvec, pvec);
    if (u < 0.0 || u > det) {
      return false;
    }

    // prepare to test V parameter
    let qvec = cross(tvec, edge1);

    // calculate V parameter and test bounds
    v = dot((*ray).direction, qvec);
    if (v < 0.0 || u + v > det) {
      return false;
    }

    // calculate t, scale parameters, ray intersects triangle
    t      = dot(edge2, qvec);

    t = t * invDet;
    u = u * invDet;
    v = v * invDet;

  } else {

    if (det > -EPSILON && det < EPSILON) {
      return false;  // ray is parallel to the tri
    }
    
    // calculate distance from vert0 to ray origin
    let tvec = (*ray).origin - v0;

    // calculate U parameter and test bounds
    u = dot(tvec, pvec) * invDet;
    if (u < 0.0 || u > 1.0) {
      return false;
    }

    // prepare to test V parameter
    let qvec = cross(tvec, edge1);

    // calculate V parameter and test bounds
    v = dot((*ray).direction, qvec) * invDet;
    if (v < 0.0 || u + v > 1.0) {
      return false;
    }

    // calculate t, ray intersects triangle
    t = dot(edge2, qvec) * invDet;
  }

  if (t < EPSILON) {
    return false;
  }

  (*rec).t             = t;
  (*rec).p             = rayAt(ray, (*rec).t);
  (*rec).materialIndex = tri.materialIndex;

  let outwardNormal = normalize((n0 + n1 + n2).xyz);
  (*rec).normal    = outwardNormal;
  (*rec).frontFace = true;


  return true;
}