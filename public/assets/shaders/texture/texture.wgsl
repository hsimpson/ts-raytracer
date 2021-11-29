
let TEXTURETYPE_SOLID = 0u;
let TEXTURETYPE_CHECKER = 1u;
let TEXTURETYPE_NOISE = 2u;
let TEXTURETYPE_IMAGE = 3u;

#include "./texture_base.wgsl"
#include "./solid.wgsl"

fn textureValue(texture: Texture, uv: vec2<f32>, p: vec3<f32>) -> vec3<f32> {
  var color = vec3<f32>(0.0, 0.0, 0.0);
  let textureType = texture.textureType;
  // let textureType = 0u;

  switch(textureType) {
    case 0u: {
      color = solidTextureValue(texture, uv, p);
      // color = vec3<f32>(0.0, 1.0, 0.0);
      break;
    }

    default: {
      break;
    }
  }

  return color;
}