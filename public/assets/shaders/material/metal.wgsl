#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

fn metalScatter(
  material: Material,
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
  attenuation: ptr<function, vec3<f32>>,
  scattered: ptr<function, Ray>,
) -> bool {
  let reflected = reflect(normalize((*ray).direction), (*rec).normal);
  *scattered = Ray((*rec).p, reflected + material.roughness * randomInUnitSphere(), (*ray).time);

  *attenuation = material.baseColor.rgb;
  if(dot((*scattered).direction, (*rec).normal) > 0.0){
    return true;
  }
  return false;
}