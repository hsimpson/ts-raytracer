import { vec2, vec3 } from 'gl-matrix';
import { HitRecord } from './raytracer-cpu/hitrecord';
import { LambertianMaterial } from './raytracer-cpu/lambertian';
import { NormalMaterial } from './raytracer-cpu/normalmaterial';
import { Ray } from './raytracer-cpu/ray';
import { serializable } from './serializing';

function avgVector3(vectors: vec3[]): vec3 {
  let x = 0,
    y = 0,
    z = 0;
  for (const v of vectors) {
    x += v[0];
    y += v[1];
    z += v[2];
  }
  return [x / vectors.length, y / vectors.length, z / vectors.length];
}

const EPSILON = 0.0000001;
const REDMATERIAL = new LambertianMaterial([0.65, 0.05, 0.05]);
const NORMALMATERIAL = new NormalMaterial();
@serializable
export class Triangle {
  public readonly v0: vec3;
  public readonly n0: vec3;
  public readonly uv0: vec2;

  public readonly v1: vec3;
  public readonly n1: vec3;
  public readonly uv1: vec2;

  public readonly v2: vec3;
  public readonly n2: vec3;
  public readonly uv2: vec2;

  public readonly surfaceNormal: vec3;

  public constructor(
    v0: vec3,
    v1: vec3,
    v2: vec3,
    n0?: vec3,
    n1?: vec3,
    n2?: vec3,
    uv0?: vec2,
    uv1?: vec2,
    uv2?: vec2
  ) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    this.n0 = n0;
    this.n1 = n1;
    this.n2 = n2;

    if (n0 === undefined || n1 === undefined || n2 === undefined) {
      /*
      For each triangle ABC
        n := normalize(cross(B-A, C-A))
        A.n := n
        B.n := n
        C.n := n
      */

      const edge1 = vec3.create();
      const edge2 = vec3.create();
      const faceNormal = vec3.create();

      vec3.subtract(edge1, this.v1, this.v0);
      vec3.subtract(edge2, this.v2, this.v0);

      vec3.cross(faceNormal, edge1, edge2);
      vec3.normalize(faceNormal, faceNormal);

      this.n0 = faceNormal;
      this.n1 = faceNormal;
      this.n2 = faceNormal;
    }

    this.surfaceNormal = vec3.create();
    vec3.normalize(this.surfaceNormal, avgVector3([this.n0, this.n1, this.n2]));

    this.uv0 = uv0 ?? [0, 0];
    this.uv1 = uv1 ?? [0, 0];
    this.uv2 = uv2 ?? [0, 0];
  }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const edge1 = vec3.create();
    const edge2 = vec3.create();
    const h = vec3.create();
    const s = vec3.create();
    const q = vec3.create();

    const rayOrigin = vec3.create();
    vec3.set(rayOrigin, ray.origin[0], ray.origin[1], ray.origin[2]);

    const rayDirection = vec3.create();
    vec3.set(rayDirection, ray.direction[0], ray.direction[1], ray.direction[2]);

    vec3.subtract(edge1, this.v1, this.v0);
    vec3.subtract(edge2, this.v2, this.v0);
    vec3.cross(h, rayDirection, edge2);
    const a = vec3.dot(edge1, h);
    if (a > -EPSILON && a < EPSILON) {
      return false; // ray is parallel to the triangle
    }

    const f = 1.0 / a;
    vec3.sub(s, rayOrigin, this.v0);
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

      const w = 1.0 - u - v;
      const n0 = vec3.create();
      const n1 = vec3.create();
      const n2 = vec3.create();
      vec3.scale(n0, this.n0, w);
      vec3.scale(n1, this.n1, u);
      vec3.scale(n2, this.n2, v);
      const normal = vec3.create();
      vec3.add(normal, n0, n1);
      vec3.add(normal, normal, n2);
      vec3.normalize(normal, normal);

      const outIntersectionPoint = vec3.create();
      vec3.add(outIntersectionPoint, rayOrigin, rayDirection);
      vec3.scale(outIntersectionPoint, outIntersectionPoint, t);
      // rec.p = [outIntersectionPoint[0], outIntersectionPoint[0], outIntersectionPoint[0]];
      // rec.mat = REDMATERIAL;
      rec.mat = NORMALMATERIAL;

      //FIXME: replace when everything is gl-matrix vec3
      // rec.setFaceNormal(ray, [this.surfaceNormal[0], this.surfaceNormal[1], this.surfaceNormal[2]]);
      rec.setFaceNormal(ray, [normal[0], normal[1], normal[2]]);

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
}

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
