import { vec3 } from 'gl-matrix';

export function D_GGX(NoH: number, roughness: number): number {
  const a = NoH * roughness;
  const k = roughness / (1.0 - NoH * NoH + a * a);
  return k * k * (1.0 / Math.PI);
}

export function F_Schlick(f0: vec3, LoH: number): vec3 {
  //F0+(1-F0)(1-(l⋅h))^5

  const f = Math.pow(1.0 - LoH, 5.0);
  const Fschlick = vec3.fromValues(1, 1, 1);
  vec3.subtract(Fschlick, Fschlick, f0);
  vec3.scale(Fschlick, Fschlick, f);
  vec3.add(Fschlick, f0, Fschlick);

  return Fschlick;
}

export function V_SmithGGXCorrelated(NoV: number, NoL: number, roughness: number): number {
  const a2 = roughness * roughness;
  const GGXV = NoL * Math.sqrt(NoV * NoV * (1.0 - a2) + a2);
  const GGXL = NoV * Math.sqrt(NoL * NoL * (1.0 - a2) + a2);
  return 0.5 / (GGXV + GGXL);
}

export function Fd_Lambert(): number {
  return 1.0 / Math.PI;
}
