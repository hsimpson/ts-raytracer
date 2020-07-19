#version 460

layout(location = 0) in vec3 inPosition;
layout(location = 0) out vec2 uv;

void main() {
  gl_Position = vec4(inPosition, 1.0);
  uv          = inPosition.xy;
  uv.y *= -1;
  uv = (uv + 1) / 2;
}
