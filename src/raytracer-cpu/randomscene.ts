import BaseMaterial from './basematerial';
import DielectricMaterial from './dielectric';
import { HittableList } from './hittablelist';
import LambertianMaterial from './lambertian';
import MetalMaterial from './metal';
import Sphere from './sphere';
import { randomNumber, randomNumberRange } from '../util';
import Vec3 from '../vec3';

export default function randomScene(): HittableList {
  const world = new HittableList();

  const groundMaterial = new LambertianMaterial(new Vec3(0.5, 0.5, 0.5));
  world.add(new Sphere(new Vec3(0, -1000, 0), 1000, groundMaterial));
  let i = 1;
  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      console.log(`${i++}`);
      const chooseMat = randomNumber();
      const center = new Vec3(a + 0.9 * randomNumber(), 0.2, b + 0.9 * randomNumber());

      if (Vec3.subVec3(center, new Vec3(4, 0.2, 0)).length() > 0.9) {
        let sphereMaterial: BaseMaterial;

        if (chooseMat < 0.8) {
          // diffuse
          const albedo = Vec3.multVec3(Vec3.random(), Vec3.random());
          sphereMaterial = new LambertianMaterial(albedo);
        } else if (chooseMat < 0.95) {
          // metal
          const albedo = Vec3.randomRange(0.5, 1);
          const roughness = randomNumberRange(0, 0.5);
          sphereMaterial = new MetalMaterial(albedo, roughness);
        } else {
          // glass
          sphereMaterial = new DielectricMaterial(1.5);
        }

        world.add(new Sphere(center, 0.2, sphereMaterial));
      }
    }
  }

  const material1 = new DielectricMaterial(1.5);
  const material2 = new LambertianMaterial(new Vec3(0.4, 0.2, 0.1));
  const material3 = new MetalMaterial(new Vec3(0.7, 0.6, 0.5), 0.0);

  world.add(new Sphere(new Vec3(1, 1, 0), 1, material1));
  world.add(new Sphere(new Vec3(-4, 1, 0), 1, material2));
  world.add(new Sphere(new Vec3(4, 1, 0), 1, material3));

  return world;
}
