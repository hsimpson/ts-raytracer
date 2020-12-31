import Ray from './ray';
import { HitRecord } from './hittable';
import { vec3 } from 'gl-matrix';
import LambertianMaterial from './lambertian';
import { NormalMaterial } from './normalmaterial';
import { Triangle } from '../triangle';

/*

       V0
       /\
      /  \
     /    \
    /      \
   /        \
V2 ---------- V1

*/

/* Möller–Trumbore ray-triangle intersection algorithm (C++)
bool RayIntersectsTriangle(Vector3D rayOrigin, 
                           Vector3D rayDirection, 
                           Triangle* inTriangle,
                           Vector3D& outIntersectionPoint)
{
    const float EPSILON = 0.0000001;
    Vector3D vertex0 = inTriangle->vertex0;
    Vector3D vertex1 = inTriangle->vertex1;  
    Vector3D vertex2 = inTriangle->vertex2;
    Vector3D edge1, edge2, h, s, q;
    float a,f,u,v;
    edge1 = vertex1 - vertex0;
    edge2 = vertex2 - vertex0;
    h = rayDirection.crossProduct(edge2);
    a = edge1.dotProduct(h);
    if (a > -EPSILON && a < EPSILON)
        return false;    // This ray is parallel to this triangle.
    f = 1.0/a;
    s = rayOrigin - vertex0;
    u = f * s.dotProduct(h);
    if (u < 0.0 || u > 1.0)
        return false;
    q = s.crossProduct(edge1);
    v = f * rayDirection.dotProduct(q);
    if (v < 0.0 || u + v > 1.0)
        return false;
    // At this stage we can compute t to find out where the intersection point is on the line.
    float t = f * edge2.dotProduct(q);
    if (t > EPSILON) // ray intersection
    {
        outIntersectionPoint = rayOrigin + rayDirection * t;
        return true;
    }
    else // This means that there is a line intersection but not a ray intersection.
        return false;
}
*/

const EPSILON = 0.0000001;
const REDMATERIAL = new LambertianMaterial([0.65, 0.05, 0.05]);
const NORMALMATERIAL = new NormalMaterial();

export function triangleIntersect(triangle: Triangle, ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
  //Vector3D edge1, edge2, h, s, q;
  const edge1 = vec3.create();
  const edge2 = vec3.create();
  const h = vec3.create();
  const s = vec3.create();
  const q = vec3.create();

  const rayOrigin = vec3.create();
  vec3.set(rayOrigin, ray.origin[0], ray.origin[1], ray.origin[2]);

  const rayDirection = vec3.create();
  vec3.set(rayDirection, ray.direction[0], ray.direction[1], ray.direction[2]);

  vec3.subtract(edge1, triangle.v1, triangle.v0);
  vec3.subtract(edge2, triangle.v2, triangle.v0);
  vec3.cross(h, rayDirection, edge2);
  const a = vec3.dot(edge1, h);
  if (a > -EPSILON && a < EPSILON) {
    return false; // ray is parallel to the triangle
  }

  const f = 1.0 / a;
  vec3.sub(s, rayOrigin, triangle.v0);
  const u = f * vec3.dot(s, h);

  if (u < 0.0 || u > 1.0) {
    return false;
  }

  vec3.cross(q, s, edge1);
  const v = f * vec3.dot(rayDirection, q);

  if (v < 0.0 || u + v > 1.0) {
    return false;
  }

  // At this stage we can compute t to find out where the intersection point is on the line.
  const t = f * vec3.dot(edge2, q);
  if (t > EPSILON) {
    //ray intersection
    rec.t = t;
    rec.p = ray.at(t);

    const outIntersectionPoint = vec3.create();
    vec3.add(outIntersectionPoint, rayOrigin, rayDirection);
    vec3.scale(outIntersectionPoint, outIntersectionPoint, t);
    // rec.p = [outIntersectionPoint[0], outIntersectionPoint[0], outIntersectionPoint[0]];
    // rec.mat = REDMATERIAL;
    rec.mat = NORMALMATERIAL;

    //FIXME: replace when everything is gl-matrix vec3
    rec.setFaceNormal(ray, [triangle.surfaceNormal[0], triangle.surfaceNormal[1], triangle.surfaceNormal[2]]);

    // FIXME: this is only a hack, to avoid backfacing faces to show up
    if (!rec.frontFace) {
      return false;
    }

    // TODO: interpolated normal vectors
    // TODO: UV

    return true;
  }

  return false;
}

export function triangleListIntersect(
  triangles: Triangle[],
  ray: Ray,
  tMin: number,
  tMax: number,
  rec: HitRecord
): boolean {
  const tempRecord = new HitRecord();
  let hitAnything = false;
  let closestSoFar = tMax;

  for (const triangle of triangles) {
    if (triangleIntersect(triangle, ray, tMin, closestSoFar, tempRecord)) {
      hitAnything = true;
      closestSoFar = tempRecord.t;

      tempRecord.copyTo(rec);
    }
  }

  return hitAnything;
}
