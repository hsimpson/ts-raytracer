import { vec3 } from 'gl-matrix';

export abstract class Texture {
  public abstract value(u: number, v: number, p: vec3): vec3;
}
