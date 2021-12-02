let MATERIALTYPE_LAMBERTIAN = 0u;
let MATERIALTYPE_METAL = 1u;
let MATERIALTYPE_DIELECTRIC = 2u;
let MATERIALTYPE_ISOTROPIC = 3u;
let MATERIALTYPE_DIFFUSELIGHT = 4u;
let MATERIALTYPE_NORMAL = 5u;

#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"

#include "./lambertian.wgsl"
#include "./metal.wgsl"
#include "./dielectric.wgsl"
#include "./diffuselight.wgsl"
#include "./normal.wgsl"

fn materialScatter(
  ray: ptr<function, Ray, read_write>,
  rec: ptr<function, HitRecord, read_write>,
  attenuation: ptr<function, vec3<f32>, read_write>,
  scattered: ptr<function, Ray, read_write>,
) -> bool {
  let materialIndex = (*rec).materialIndex;
  let material = materialBuffer.materials[materialIndex];
  let materialType = material.materialType;

  var wasScattered = false;

  if(materialType == MATERIALTYPE_LAMBERTIAN) {
    wasScattered = lambertScatter(material, ray, rec, attenuation, scattered);
  } elseif(materialType == MATERIALTYPE_METAL) {
    wasScattered = metalScatter(material, ray, rec, attenuation, scattered);
  } elseif(materialType == MATERIALTYPE_DIELECTRIC) {
    wasScattered = dielectricScatter(material, ray, rec, attenuation, scattered);
  } elseif(materialType == MATERIALTYPE_NORMAL) {
    wasScattered =  normalScattered(material, ray, rec, attenuation, scattered);
  } else {
    wasScattered = false;
  }

  return wasScattered;
}

fn materialEmitted(
  ray: ptr<function, Ray, read_write>,
  rec: ptr<function, HitRecord, read_write>,
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
