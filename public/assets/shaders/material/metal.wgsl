#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

fn metalScatter(
  material: Material,
  ray: ptr<function, Ray, read_write>,
  rec: ptr<function, HitRecord, read_write>,
  attenuation: ptr<function, vec3<f32>, read_write>,
  scattered: ptr<function, Ray, read_write>,
) -> bool {
  let reflected = reflect(normalize((*ray).direction), (*rec).normal);
  *scattered = Ray((*rec).p, reflected + material.roughness * randomInUnitSphere(), (*ray).time);

  *attenuation = material.baseColor.rgb;
  if(dot((*scattered).direction, (*rec).normal) > 0.0){
    return true;
  }
  return false;
}