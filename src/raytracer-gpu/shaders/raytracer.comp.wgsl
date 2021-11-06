
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
[[binding(0), group(0)]] var<uniform> computeParams: ComputeParams;

[[block]] struct PixelBuffer {
  pixels: array<vec4<f32>>;
};

[[block]] struct AccumlationBuffer {
  pixels: array<vec4<f32>>;
};

[[binding(2), group(0)]] var<storage, read_write> pixelBuffer : PixelBuffer;
[[binding(3), group(0)]] var<storage, read_write> accumulationBuffer : AccumlationBuffer;


[[stage(compute), workgroup_size(8,8,1)]]
fn main([[builtin(global_invocation_id)]] GlobalInvocationID: vec3<u32>) {
  var index: vec2<u32> = GlobalInvocationID.xy;
  index.x = index.x + u32(computeParams.tileOffsetX);
  index.y = index.y + u32(computeParams.tileOffsetY);

  var pixelColor: vec3<f32> = vec3<f32>(0.578, 0.656, 1.0);

  let pixelIndex: u32 = index.y * u32(computeParams.width) + index.x;
  let accumulatedColor: vec3<f32> = accumulationBuffer.pixels[pixelIndex].rgb + pixelColor;
  pixelColor = accumulatedColor * (1.0 / computeParams.currentSample);
  accumulationBuffer.pixels[pixelIndex] = vec4<f32>(accumulatedColor, 1.0);

  pixelColor = pow(pixelColor, vec3<f32>(1.0 / 2.2));
  pixelBuffer.pixels[pixelIndex] = vec4<f32>(pixelColor, 1.0);

}