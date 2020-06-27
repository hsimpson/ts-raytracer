import './style.css';
import vec3, { write_color } from './vec3';
import { ray_color } from './ray';
import { hittable_list } from './hittable_list';
import sphere from './sphere';
import camera from './camera';
import { random_number } from './util';
import lambertian from './lambertian';
import metal from './metal';

const canvas: HTMLCanvasElement = document.getElementById('rendercanvas') as HTMLCanvasElement;

const aspect_ratio = 16 / 9;
const image_width = 800;
const image_height = image_width / aspect_ratio;

const samples_per_pixel = 50;
const max_depth = 10;

canvas.width = image_width;
canvas.height = image_height;

canvas.style.width = `${image_width}px`;
canvas.style.height = `${image_height}px`;

const context = canvas.getContext('2d');

const imageData = context.createImageData(image_width, image_height);

const start = performance.now();
let offset = 0;
const world = new hittable_list();
world.add(new sphere(new vec3(0, 0, -1), 0.5, new lambertian(new vec3(0.7, 0.3, 0.3))));
world.add(new sphere(new vec3(0, -100.5, -1), 100, new lambertian(new vec3(0.8, 0.8, 0))));

world.add(new sphere(new vec3(1, 0, -1), 0.5, new metal(new vec3(0.8, 0.6, 0.2), 1.0)));
world.add(new sphere(new vec3(-1, 0, -1), 0.5, new metal(new vec3(0.8, 0.8, 0.8), 0.3)));

const cam = new camera();

for (let j = image_height - 1; j >= 0; --j) {
  console.log(`Scanlines remaining ${j}`);
  for (let i = 0; i < image_width; i++) {
    let pixel_color = new vec3(0, 0, 0);

    for (let s = 0; s < samples_per_pixel; s++) {
      const u = (i + random_number()) / (image_width - 1);
      const v = (j + random_number()) / (image_height - 1);

      const r = cam.get_ray(u, v);
      pixel_color = vec3.addVec3(pixel_color, ray_color(r, world, max_depth));
    }

    write_color(imageData.data, offset, pixel_color, samples_per_pixel);
    offset += 4;
  }
}
const end = performance.now();
console.log(`duration=${(end - start).toFixed(3)}ms`);

context.putImageData(imageData, 0, 0);
