#version 460

layout(location = 0) in vec2 uv;

layout(location = 0) out vec4 outColor;

layout(set = 0, binding = 0) uniform ComputeParams {
  float fWidth;
  float fHeight;
  float fSample;
}
params;

layout(std140, set = 0, binding = 1) buffer PixelBuffer {
  vec4 pixels[];
}
pixelBuffer;

void main() {
  vec2       resolution  = vec2(params.fWidth, params.fHeight);
  ivec2      bufferCoord = ivec2(floor(uv * resolution));
  const uint pixelIndex  = bufferCoord.y * uint(resolution.x) + bufferCoord.x;

  vec4 pixelColor = pixelBuffer.pixels[pixelIndex];
  outColor        = pixelColor / params.fSample;
}
