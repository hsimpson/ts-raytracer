
#include "../ray.wgsl"
#include "./material_base.wgsl"
#include "../texture/texture.wgsl"

fn diffuseLightEmitted(material: Material, rec: ptr<function, HitRecord>) -> vec3<f32> {
  let textureIndex = material.textureIndex;
  let texture = textureBuffer.textures[textureIndex];
  
  return textureValue(texture, (*rec).uv, (*rec).p);
}