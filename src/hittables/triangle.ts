import { vec2, vec3 } from 'gl-matrix';
import { Material } from '../material';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Ray } from '../raytracer-cpu/ray';
import { Transform } from '../raytracer-cpu/transform';
import { serializable } from '../serializing';
import { AABB } from './aabb';
import { Hittable } from './hittable';

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

const EPSILON = 1e-8;
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

  public material: Material;
  public doubleSided = false;

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
    vec3.transformMat4(this.v0, this.v0, this.transform.objectToWorld);
    vec3.transformMat4(this.v1, this.v1, this.transform.objectToWorld);
    vec3.transformMat4(this.v2, this.v2, this.transform.objectToWorld);

    vec3.transformMat4(this.n0, this.n0, this.transform.normalMatrix);
    vec3.transformMat4(this.n1, this.n1, this.transform.normalMatrix);
    vec3.transformMat4(this.n2, this.n2, this.transform.normalMatrix);

    vec3.normalize(this.n0, this.n0);
    vec3.normalize(this.n1, this.n1);
    vec3.normalize(this.n2, this.n2);
  }

  // public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
  //   const transformedRay = this.transform.transformRay(ray);

  //   const edge1 = vec3.create();
  //   const edge2 = vec3.create();

  //   const pvec = vec3.create();
  //   const tvec = vec3.create();
  //   const qvec = vec3.create();

  //   let u, v, t;

  //   /* find vectors for two edges sharing vert */
  //   vec3.sub(edge1, this.v1, this.v0);
  //   vec3.sub(edge2, this.v2, this.v0);

  //   /* begin calculating determinant - also used to calculate U parameter */
  //   vec3.cross(pvec, transformedRay.direction, edge2);

  //   /*if determinant is near zero, ray lies in plane of triangle */
  //   const det = vec3.dot(edge1, pvec);

  //   if (this.doubleSided) {
  //     if (det < EPSILON) {
  //       return false;
  //     }

  //     /* calculate distance from vert0 to ray origin */
  //     vec3.subtract(tvec, transformedRay.origin, this.v0);

  //     /* calculate U parameter and test bounds */
  //     u = vec3.dot(tvec, pvec);
  //     if (u < 0.0 || u > det) {
  //       return false;
  //     }

  //     /* prepare to test V parameter */
  //     vec3.cross(qvec, tvec, edge1);

  //     /* calculate V parameter and test bounds */
  //     v = vec3.dot(transformedRay.direction, qvec);
  //     if (v < 0.0 || u + v > det) {
  //       return false;
  //     }

  //     /* calculate t, scale parameters, ray intersects triangle */
  //     t = vec3.dot(edge2, qvec);
  //     const invDet = 1.0 / det;

  //     t *= invDet;
  //     u *= invDet;
  //     v *= invDet;
  //   } else {
  //     // non backface culling
  //     if (det > -EPSILON && det < EPSILON) {
  //       return false; // ray is parallel to the tri
  //     }

  //     const invDet = 1.0 / det;
  //     /* calculate distance from vert0 to ray origin */
  //     vec3.subtract(tvec, transformedRay.origin, this.v0);

  //     /* calculate U parameter and test bounds */
  //     u = vec3.dot(tvec, pvec) * invDet;
  //     if (u < 0.0 || u > 1.0) {
  //       return false;
  //     }

  //     /* prepare to test V parameter */
  //     vec3.cross(qvec, tvec, edge1);
  //     /* calculate V parameter and test bounds */
  //     v = vec3.dot(transformedRay.direction, qvec) * invDet;
  //     if (v < 0.0 || u + v > 1.0) {
  //       return false;
  //     }

  //     /* calculate t, ray intersects triangle */
  //     t = vec3.dot(edge2, qvec) * invDet;
  //   }

  //   if (t < EPSILON) {
  //     return false;
  //   }

  //   rec.u = u;
  //   rec.v = v;
  //   rec.t = t;

  //   rec.p = transformedRay.at(t);
  //   rec.mat = this.material;
  //   const w = 1.0 - u - v;

  //   const n0 = vec3.create();
  //   const n1 = vec3.create();
  //   const n2 = vec3.create();
  //   vec3.scale(n0, this.n0, w);
  //   vec3.scale(n1, this.n1, u);
  //   vec3.scale(n2, this.n2, v);
  //   const normal = vec3.create();
  //   vec3.add(normal, n0, n1);
  //   vec3.add(normal, normal, n2);
  //   vec3.normalize(normal, normal);

  //   rec.setFaceNormal(transformedRay, [normal[0], normal[1], normal[2]]);

  //   this.transform.transformRecord(transformedRay, rec);

  //   return true;
  // }

  /* from https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf */
  public hit(ray: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {
    const transformedRay = this.transform.transformRay(ray);

    /* find vectors for two edges sharing vert */
    const edge1 = vec3.subtract(vec3.create(), this.v1, this.v0);
    const edge2 = vec3.subtract(vec3.create(), this.v2, this.v0);

    /* begin calculating determinant - also used to calculate U parameter */
    const pvec = vec3.cross(vec3.create(), transformedRay.direction, edge2);

    /*if determinant is near zero, ray lies in plane of triangle */
    const det = vec3.dot(edge1, pvec);

    let t, u, v;

    if (!this.doubleSided) {
      if (det < EPSILON) {
        return false;
      }

      /* calculate distance from vert0 to ray origin */
      const tvec = vec3.subtract(vec3.create(), transformedRay.origin, this.v0);

      /* calculate U parameter and test bounds */
      u = vec3.dot(tvec, pvec);
      if (u < 0.0 || u > det) {
        return false;
      }

      /* prepare to test V parameter */
      const qvec = vec3.cross(vec3.create(), tvec, edge1);

      /* calculate V parameter and test bounds */
      v = vec3.dot(transformedRay.direction, qvec);
      if (v < 0.0 || u + v > det) {
        return false;
      }

      /* calculate t, scale parameters, ray intersects triangle */
      t = vec3.dot(edge2, qvec);
      const invDet = 1.0 / det;

      t *= invDet;
      u *= invDet;
      v *= invDet;
    } else {
      if (det > -EPSILON && det < EPSILON) {
        return false; // ray is parallel to the tri
      }

      const invDet = 1.0 / det;

      /* calculate distance from vert0 to ray origin */
      const tvec = vec3.subtract(vec3.create(), transformedRay.origin, this.v0);

      /* calculate U parameter and test bounds */
      u = vec3.dot(tvec, pvec) * invDet;
      if (u < 0.0 || u > 1.0) {
        return false;
      }

      /* prepare to test V parameter */
      const qvec = vec3.cross(vec3.create(), tvec, edge1);

      /* calculate V parameter and test bounds */
      v = vec3.dot(transformedRay.direction, qvec) * invDet;
      if (v < 0.0 || u + v > 1.0) {
        return false;
      }

      /* calculate t, ray intersects triangle */
      t = vec3.dot(edge2, qvec);
    }

    if (t < EPSILON) {
      return false;
    }

    rec.t = t;
    rec.p = transformedRay.at(t);
    rec.mat = this.material;

    const w = 1.0 - u - v;

    const n0 = vec3.scale(vec3.create(), this.n0, w);
    const n1 = vec3.scale(vec3.create(), this.n1, u);
    const n2 = vec3.scale(vec3.create(), this.n2, v);

    const outwardNormal = vec3.normalize(vec3.create(), vec3.add(vec3.create(), vec3.add(vec3.create(), n0, n1), n2));
    rec.normal = outwardNormal;
    rec.frontFace = true;

    return true;
  }

  public boundingBox(t0: number, t1: number, outputBox: AABB): boolean {
    const v0 = vec3.create();
    const v1 = vec3.create();
    const v2 = vec3.create();

    vec3.transformMat4(v0, this.v0, this.transform.objectToWorld);
    vec3.transformMat4(v1, this.v1, this.transform.objectToWorld);
    vec3.transformMat4(v2, this.v2, this.transform.objectToWorld);

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
