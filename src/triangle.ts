import { vec2, vec3 } from 'gl-matrix';

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

    if (!n0 || !n1 || n2) {
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

    this.uv0 = uv0;
    this.uv1 = uv1;
    this.uv2 = uv2;

    this.uv0 = uv0 || [0, 0];
    this.uv1 = uv1 || [0, 0];
    this.uv2 = uv2 || [0, 0];
  }
}
