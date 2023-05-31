#include "../utils.wgsl"
#include "../ray.wgsl"
#include "./material_base.wgsl"
#include "../texture/texture.wgsl"

fn lambertScatter(
  material: Material,
  ray: ptr<function, Ray>,
  rec: ptr<function, HitRecord>,
  attenuation: ptr<function, vec3<f32>>,
  scattered: ptr<function, Ray>,
) -> bool {
  let scatterDirection = (*rec).normal + randomUnitVector();
  *scattered = Ray((*rec).p, scatterDirection, (*ray).time);

  let textureIndex = material.textureIndex;
  let texture = textureBuffer.textures[textureIndex];
  *attenuation  = textureValue(texture, (*rec).uv, (*rec).p);

  return true;
}
