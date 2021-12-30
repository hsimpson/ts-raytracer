#include "./ray.wgsl"

struct Camera {
  origin: vec4<f32>;
  lowerLeftCorner: vec4<f32>;
  horizontal: vec4<f32>;
  vertical: vec4<f32>;
  u: vec4<f32>;
  v: vec4<f32>;
  w: vec4<f32>;
  lensRadius: f32;
  t0: f32;
  t1: f32;
};
[[group(0), binding(1)]] var<uniform> camera: Camera;


fn cameraGetRay(s: f32, t: f32) -> Ray {
  let rd: vec3<f32> = camera.lensRadius * randomInUnitDisk();
  let offset: vec3<f32> = camera.u.xyz * rd.x + camera.v.xyz * rd.y;

  return Ray(
    camera.origin.xyz + offset,
    camera.lowerLeftCorner.xyz + s * camera.horizontal.xyz + t * camera.vertical.xyz - camera.origin.xyz - offset,
    randomMinMax(camera.t0, camera.t1)
  );
}