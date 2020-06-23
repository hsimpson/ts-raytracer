import './style.css';
import vec3, { write_color } from './vec3';
import ray, { ray_color } from './ray';

const canvas: HTMLCanvasElement = document.getElementById('rendercanvas') as HTMLCanvasElement;

const aspect_ratio = 16 / 9;
const image_width = 384;
const image_height = image_width / aspect_ratio;

canvas.width = image_width;
canvas.height = image_height;

canvas.style.width = `${image_width}px`;
canvas.style.height = `${image_height}px`;

const viewport_height = 2.0;
const viewport_width = aspect_ratio * viewport_height;
const focal_lenght = 1.0;

const origin = new vec3(0, 0, 0);
const horizontal = new vec3(viewport_width, 0, 0);
const vertical = new vec3(0, viewport_height, 0);
const view_direction = new vec3(0, 0, focal_lenght);

const half_horizontal = vec3.divScalarVec(horizontal, 2);
const half_vertical = vec3.divScalarVec(vertical, 2);

const lower_left_corner = vec3.subVec3(
  vec3.subVec3(vec3.subVec3(origin, half_horizontal), half_vertical),
  view_direction
);

const context = canvas.getContext('2d');

const imageData = context.createImageData(image_width, image_height);

const start = performance.now();
let offset = 0;
for (let j = image_height - 1; j >= 0; --j) {
  console.log(`Scanlines remaining ${j}`);
  for (let i = 0; i < image_width; i++) {
    const u = i / (image_width - 1);
    const v = j / (image_height - 1);

    const vecU = vec3.multSclarVec3(horizontal, u);
    const vecV = vec3.multSclarVec3(vertical, v);

    const r = new ray(origin, vec3.subVec3(vec3.addVec3(vec3.addVec3(lower_left_corner, vecU), vecV), origin));

    const pixel_color = ray_color(r);
    write_color(imageData.data, offset, pixel_color);
    offset += 4;
  }
}
const end = performance.now();
console.log(`duration=${(end - start).toFixed(3)}ms`);

context.putImageData(imageData, 0, 0);
