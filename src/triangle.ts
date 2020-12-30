import { vec2, vec3 } from 'gl-matrix';

export class Triangle {
  public v0: vec3;
  public n0: vec3;
  public uv0: vec2;

  public v1: vec3;
  public n1: vec3;
  public uv1: vec2;

  public v2: vec3;
  public n2: vec3;
  public uv2: vec2;

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
      this.calcFlatNormals();
    }

    this.uv0 = uv0;
    this.uv1 = uv1;
    this.uv2 = uv2;
  }

  private calcFlatNormals(): void {}
}
