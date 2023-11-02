#include "./texture_base.wgsl"

@group(0) @binding(7) var textureSampler: sampler;
@group(0) @binding(8) var imageTexture: texture_2d<f32>;

fn imageTextureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  var clamped = clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0));
  clamped.y = 1.0 - clamped.y;

  // textureSample only works in fragment stage
  let color = textureSampleLevel(imageTexture, textureSampler, clamped, 0.0).rgb;
  return color;
}