#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

const NORMAL_CORRECTED = true;

fn normalScattered(
  material: Material,
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
  attenuation: ptr<function, vec3<f32>>,
  scattered: ptr<function, Ray>,
) -> bool {
  if(NORMAL_CORRECTED) {
    *attenuation = normalize(((*rec).normal + 1.0) * 0.5);
  } else {
    *attenuation = (*rec).normal;
  }

  return true;
}