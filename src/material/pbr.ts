import { serializable } from '../serializing';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { HitRecord } from '../raytracer-cpu/hitrecord';
import { Material } from './material';
import { Ray } from '../raytracer-cpu/ray';
import { vec3 } from 'gl-matrix';
import { clamp } from '../util';
import { D_GGX, F_Schlick, V_SmithGGXCorrelated, Fd_Lambert } from './brdfs';

@serializable
export class PBRMaterial extends Material {
  private _baseColor: vec3;
  private _metallic: number;
  private _roughness: number;
  private _ior: number;
  private _f0: vec3;
  private _light: Vec3;

  public constructor(color: vec3, metallic: number, roughness: number) {
    super();

    this._baseColor = color;
    this._metallic = metallic;
    this._roughness = roughness;

    this._ior = 1.5;
    this._f0 = this.f0();

    this._light = [0, 2, 2];
  }

  public scatter(ray: Ray, rec: HitRecord, attenuation: Vec3, scattered: Ray): boolean {
    const scatter_direction = Vector.addVec3(rec.normal, Vector.randomUnitVector());
    new Ray(rec.p, scatter_direction, ray.time).copyTo(scattered);

    const v = vec3.create();
    const l = vec3.create();

    vec3.subtract(v, ray.origin, rec.p);
    // vec3.subtract(v, rec.p, ray.origin);
    // vec3.subtract(l, this._light, rec.p);
    vec3.subtract(l, rec.p, this._light);

    vec3.normalize(v, v);
    vec3.normalize(l, l);

    const col = this.pbrBRDF(v, l, rec.normal);
    Vector.copyTo([col[0], col[1], col[2]], attenuation);
    return true;
  }

  private f0(): vec3 {
    const f = ((this._ior - 1) * (this._ior - 1)) / ((this._ior + 1) * (this._ior + 1));
    return vec3.fromValues(f, f, f);
  }

  private pbrBRDF(v: vec3, l: vec3, n: vec3): vec3 {
    // The BRDF describes the surface response of a standard material as a function made of two terms:
    // A diffuse component, or fd
    // A specular component, or fr

    // v  View unit vector
    // l  Incident light unit vector
    // n  Surface normal unit vector
    // h  Half unit vector between l and v

    //f(v,l) = fd(v,l) + fr(v,l)

    const h = vec3.create();
    vec3.add(h, v, l);
    vec3.normalize(h, h);

    const NoV = Math.abs(vec3.dot(n, v)) + 1e-5;
    const NoL = clamp(vec3.dot(n, l), 1e-5, 1.0);
    const NoH = clamp(vec3.dot(n, h), 1e-5, 1.0);
    const LoH = clamp(vec3.dot(l, h), 0, 1.0);

    // perceptually linear roughness to roughness (see parameterization)
    // const roughness = this._roughness * this._roughness;

    const D = D_GGX(NoH, this._roughness);
    const F = F_Schlick(this._f0, LoH);
    return F;
    /*
    const V = V_SmithGGXCorrelated(NoV, NoL, this._roughness);

    // specular BRDF
    const Fr = vec3.create();
    vec3.scale(Fr, F, D * V);

    // diffuse BRDF
    const Fd = vec3.create();
    const diffuseColor = vec3.create();
    vec3.scale(diffuseColor, this._baseColor, 1.0 - this._metallic);
    vec3.scale(Fd, diffuseColor, Fd_Lambert());

    const brdf = vec3.create();
    vec3.add(brdf, Fd, Fr);

    return brdf;
    */
  }
}
