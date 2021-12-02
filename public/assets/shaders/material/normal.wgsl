#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

let NORMAL_CORRECTED = true;

fn normalScattered(
  material: Material,
  ray: ptr<function, Ray, read_write>,
  rec: ptr<function, HitRecord, read_write>,
  attenuation: ptr<function, vec3<f32>, read_write>,
  scattered: ptr<function, Ray, read_write>,
) -> bool {
  if(NORMAL_CORRECTED) {
    *attenuation = normalize(((*rec).normal + 1.0) * 0.5);
  } else {
    *attenuation = (*rec).normal;
  }

  return true;
}