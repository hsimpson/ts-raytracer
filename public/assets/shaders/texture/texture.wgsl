
let TEXTURETYPE_SOLID = 0u;
let TEXTURETYPE_CHECKER = 1u;
let TEXTURETYPE_NOISE = 2u;
let TEXTURETYPE_IMAGE = 3u;

#include "./texture_base.wgsl"
#include "./solid.wgsl"
#include "./checker.wgsl"
#include "./noise.wgsl"
#include "./image.wgsl"

fn textureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  var color = vec3<f32>(0.0, 0.0, 0.0);
  let textureType = texture.textureType;
  
  if(textureType == TEXTURETYPE_SOLID) {
    color = solidTextureValue(texture, uv, p);
  } else if(textureType == TEXTURETYPE_CHECKER) {
    color = checkerTextureValue(texture, uv, p);
  } else if(textureType == TEXTURETYPE_NOISE) {
    color = noiseTextureValue(texture, uv, p);
  } else if(textureType == TEXTURETYPE_IMAGE) {
    color = imageTextureValue(texture, uv, p);
  }

  return color;
}