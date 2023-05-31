const MATERIALTYPE_LAMBERTIAN = 0u;
const MATERIALTYPE_METAL = 1u;
const MATERIALTYPE_DIELECTRIC = 2u;
const MATERIALTYPE_ISOTROPIC = 3u;
const MATERIALTYPE_DIFFUSELIGHT = 4u;
const MATERIALTYPE_NORMAL = 5u;

#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

#include "./lambertian.wgsl"
#include "./metal.wgsl"
#include "./dielectric.wgsl"
#include "./diffuselight.wgsl"
#include "./normal.wgsl"

fn materialScatter(
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
  attenuation: ptr<function, vec3<f32>>,
  scattered: ptr<function, Ray>,
) -> bool {
  let materialIndex = (*rec).materialIndex;
  let material = materialBuffer.materials[materialIndex];
  let materialType = material.materialType;

  var wasScattered = false;

  if(materialType == MATERIALTYPE_LAMBERTIAN) {
    wasScattered = lambertScatter(material, ray, rec, attenuation, scattered);
  } else if(materialType == MATERIALTYPE_METAL) {
    wasScattered = metalScatter(material, ray, rec, attenuation, scattered);
  } else if(materialType == MATERIALTYPE_DIELECTRIC) {
    wasScattered = dielectricScatter(material, ray, rec, attenuation, scattered);
  } else if(materialType == MATERIALTYPE_NORMAL) {
    wasScattered =  normalScattered(material, ray, rec, attenuation, scattered);
  } else {
    wasScattered = false;
  }

  return wasScattered;
}

fn materialEmitted(
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
) -> vec3<f32> {
  let materialIndex = (*rec).materialIndex;
  let material = materialBuffer.materials[materialIndex];
  let materialType = material.materialType;

  var emitted = vec3<f32> (0.0, 0.0, 0.0);

  if(materialType == MATERIALTYPE_DIFFUSELIGHT) {
    emitted = diffuseLightEmitted(material, rec);
  }

  return emitted;
}
