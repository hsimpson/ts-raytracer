#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"
#include "../texture/texture.wgsl"

fn lambertScatter(
  material: Material,
  ray: ptr<function, Ray, read_write>,
  rec: ptr<function, HitRecord, read_write>,
  attenuation: ptr<function, vec3<f32>, read_write>,
  scattered: ptr<function, Ray, read_write>,
) -> bool {
  let scatterDirection = (*rec).normal + randomUnitVector();
  *scattered = Ray((*rec).p, scatterDirection, (*ray).time);

  let textureIndex = material.textureIndex;
  let texture = textureBuffer.textures[textureIndex];
  *attenuation  = textureValue(texture, (*rec).uv, (*rec).p);

  return true;
}
