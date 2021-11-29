#include "./texture_base.wgsl"

fn solidTextureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  return texture.color.rgb;
}