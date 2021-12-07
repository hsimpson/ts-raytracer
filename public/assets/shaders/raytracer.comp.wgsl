#include "./camera.wgsl"
#include "./utils.wgsl"

let FLT_MAX = 99999.99;

[[block]] struct ComputeParams {
  background: vec3<f32>;
  tileOffsetX: f32;
  tileOffsetY: f32;
  width: f32;
  height: f32;
  currentSample: f32;
  maxBounces: f32;
  padding_0: f32;
  padding_1: f32;
  padding_2: f32;
};
[[group(0), binding(0)]] var<uniform> computeParams: ComputeParams;


[[block]] struct PixelBuffer {
  pixels: array<vec4<f32>>;
};

[[block]] struct AccumlationBuffer {
  pixels: array<vec4<f32>>;
};

[[group(0), binding(2)]] var<storage, read_write> pixelBuffer : PixelBuffer;
[[group(0), binding(3)]] var<storage, read_write> accumulationBuffer : AccumlationBuffer;

#include "./hittable/hittable.wgsl"
#include "./material/material.wgsl"

fn rayColor(ray: ptr<function, Ray, read_write>, background: vec3<f32>, depth: u32) 
-> vec3<f32> {
  var rec: HitRecord;
  var color = vec3<f32>(1.0, 1.0, 1.0);

  for(var i = 0u; i < depth; i = i + 1u) {
    if(hittableListHit(ray, 0.001, FLT_MAX, &rec)) {
      var newRay: Ray;
      var attenuation: vec3<f32>;
      let emitted = materialEmitted(ray, &rec);
      let wasScattered = materialScatter(ray, &rec, &attenuation, &newRay);
      

      (*ray) = newRay;

      if(wasScattered) {
        color = color * (emitted + attenuation);
      } else {
        color = color * emitted;
        break;
      }

    } else {
      color = color * background;
      break;
    }
  }

  return color;
}


[[stage(compute), workgroup_size(8,8,1)]]
fn main([[builtin(global_invocation_id)]] GlobalInvocationID: vec3<u32>) {
  var index: vec2<u32> = GlobalInvocationID.xy;
  index.x = index.x + u32(computeParams.tileOffsetX);
  index.y = index.y + u32(computeParams.tileOffsetY);

  let i = f32(index.x);
  let j = computeParams.height - f32(index.y);

  initSeed(index.x * index.y * u32(computeParams.currentSample) * 100000u);
  let bounces = u32(computeParams.maxBounces);
  let rnd = random();

  let u = (i + rnd) / (computeParams.width - 1.0);
  let v = (j + rnd) / (computeParams.height - 1.0);
  var ray = cameraGetRay(u, v);
  var pixelColor = rayColor(&ray, computeParams.background, bounces);


  // var pixelColor: vec3<f32> = vec3<f32>(0.578, 0.656, 1.0);
  // var pixelColor: vec3<f32> = vec3<f32>(
  //   randomMinMax(0.0, 1.0),
  //   randomMinMax(0.0, 1.0),
  //   randomMinMax(0.0, 1.0)
  // );

  let pixelIndex: u32 = index.y * u32(computeParams.width) + index.x;
  let accumulatedColor: vec3<f32> = accumulationBuffer.pixels[pixelIndex].rgb + pixelColor;
  pixelColor = accumulatedColor * (1.0 / computeParams.currentSample);
  accumulationBuffer.pixels[pixelIndex] = vec4<f32>(accumulatedColor, 1.0);

  pixelColor = pow(pixelColor, vec3<f32>(1.0 / 2.2));
  pixelBuffer.pixels[pixelIndex] = vec4<f32>(pixelColor, 1.0);
}
