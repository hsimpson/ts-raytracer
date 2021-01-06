import { vec2, vec3 } from 'gl-matrix';
import { LambertianMaterial } from './material/lambertian';
import { NormalMaterial } from './material/normalmaterial';
import { AABB } from './raytracer-cpu/aabb';
import { HitRecord } from './raytracer-cpu/hitrecord';
import { Ray } from './raytracer-cpu/ray';
import { serializable } from './serializing';
import { Hittable } from './raytracer-cpu/hittable';
import { Transform } from './raytracer-cpu/transform';

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

const EPSILON = 0.000000000001;
// const EPSILON = 0.01;
const REDMATERIAL = new LambertianMaterial([0.65, 0.05, 0.05]);
const NORMALMATERIAL = new NormalMaterial();
@serializable
export class Triangle extends Hittable {
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
  public readonly transform: Transform = new Transform();

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
    super();
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

  public applyTransform(): void {
    // vec3.transformMat4(this.v0, this.v0, this.transform.modelMatrix);
    // vec3.transformMat4(this.v1, this.v1, this.transform.modelMatrix);
    // vec3.transformMat4(this.v2, this.v2, this.transform.modelMatrix);
    // vec3.transformMat4(this.n0, this.n0, this.transform.inverseTransposeModelMatrix);
    // vec3.transformMat4(this.n1, this.n1, this.transform.inverseTransposeModelMatrix);
    // vec3.transformMat4(this.n2, this.n2, this.transform.inverseTransposeModelMatrix);
  }

  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    const edge1 = vec3.create();
    const edge2 = vec3.create();
    const h = vec3.create();
    const s = vec3.create();
    const q = vec3.create();

    const rayOrigin = vec3.create();
    vec3.set(rayOrigin, transformedRay.origin[0], transformedRay.origin[1], transformedRay.origin[2]);

    const rayDirection = vec3.create();
    vec3.set(rayDirection, transformedRay.direction[0], transformedRay.direction[1], transformedRay.direction[2]);

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
      rec.p = transformedRay.at(t);

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
      rec.setFaceNormal(transformedRay, [normal[0], normal[1], normal[2]]);

      // FIXME: this is only a hack, to avoid backfacing faces to show up
      if (!rec.frontFace) {
        return false;
      }

      // TODO: UV

      this.transform.transformRecord(transformedRay, rec);
      return true;
    }

    return false;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const v0 = vec3.create();
    const v1 = vec3.create();
    const v2 = vec3.create();

    vec3.transformMat4(v0, this.v0, this.transform.modelMatrix);
    vec3.transformMat4(v1, this.v1, this.transform.modelMatrix);
    vec3.transformMat4(v2, this.v2, this.transform.modelMatrix);

    const minX = Math.min(v0[0], v1[0], v2[0]) - EPSILON;
    const minY = Math.min(v0[1], v1[1], v2[1]) - EPSILON;
    const minZ = Math.min(v0[2], v1[2], v2[2]) - EPSILON;

    const maxX = Math.max(v0[0], v1[0], v2[0]) + EPSILON;
    const maxY = Math.max(v0[1], v1[1], v2[1]) + EPSILON;
    const maxZ = Math.max(v0[2], v1[2], v2[2]) + EPSILON;

    const newOutputBox = new AABB([minX, minY, minZ], [maxX, maxY, maxZ]);
    newOutputBox.copyTo(outputBox);

    // console.log('Triangle box');
    return true;
  }
}
