import { Vec3 } from 'wgpu-matrix';

export abstract class Texture {
  public abstract value(u: number, v: number, p: Vec3): Vec3;
}
