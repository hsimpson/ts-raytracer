import { vec3 } from 'gl-matrix';
import { HitRecord } from '../raytracer-cpu/hitrecord';

export abstract class Light {
  protected _position: vec3;
  protected _color: vec3;
  protected _intensity: number;

  public constructor(pos: vec3, color: vec3, intensity: number) {
    this._position = pos;
    this._color = color;
    this._intensity = intensity;
  }

  public get postion(): vec3 {
    return this._position;
  }

  public get color(): vec3 {
    return this._color;
  }

  public get intensity(): number {
    return this._intensity;
  }

  public abstract sampleLi(hitrecord: HitRecord): { wi: vec3; pdf: number; intensity: vec3 };
}
