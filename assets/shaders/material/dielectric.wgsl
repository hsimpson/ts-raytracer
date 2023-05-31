#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

fn schlick(cosine: f32, refractIdx: f32) -> f32 {
  var r0 = (1.0 - refractIdx) / (1.0 + refractIdx);
  r0 = r0 * r0;
  return r0 + (1.0 - r0) * pow(1.0 - cosine, 5.0);
}

fn dielectricScatter(
  material: Material,
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
  attenuation: ptr<function, vec3<f32>>,
  scattered: ptr<function, Ray>,
) -> bool {  
  *attenuation = vec3<f32>(1.0, 1.0, 1.0);
  var etaiOverEtat: f32;
  let unitDirection = normalize((*ray).direction);
  let cosTheta      = min(dot(-unitDirection, (*rec).normal), 1.0);
  let sinTheta      = sqrt(1.0 - cosTheta * cosTheta);

  if((*rec).frontFace) {
    etaiOverEtat = 1.0 / material.indexOfRefraction;
  } else {
    etaiOverEtat = material.indexOfRefraction;
  }

  if (etaiOverEtat * sinTheta > 1.0) {
    let reflected = reflect(unitDirection, (*rec).normal);
    *scattered = Ray((*rec).p, reflected, (*ray).time);
    return true;
  }

  let reflectProb = schlick(cosTheta, etaiOverEtat);
  if(random() < reflectProb) {
    let reflected = reflect(unitDirection, (*rec).normal);
    *scattered = Ray((*rec).p, reflected, (*ray).time);
    return true;
  }

  let refracted = refract(unitDirection, (*rec).normal, etaiOverEtat);
  *scattered = Ray((*rec).p, refracted, (*ray).time);
  return true;
  
}
