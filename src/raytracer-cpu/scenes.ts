import { randomNumber, randomNumberRange } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { XYRect, XZRect, YZRect } from './aarect';
import Box from './box';
import DielectricMaterial from './dielectric';
import DiffuseLight from './diffuselight';
import { HittableList } from './hittablelist';
import LambertianMaterial from './lambertian';
import Material from './material';
import MetalMaterial from './metal';
import Sphere from './sphere';
import { CheckerTexture, ImageTexture, NoiseTexture } from './texture';
import { RotateY } from './rotation';
import { Hittable } from './hittable';
import Translate from './translate';
import { ConstantMedium } from './constantmedium';

export function twoSpheres(): HittableList {
  const objects = new HittableList();

  const checkerTexture = new CheckerTexture([0.2, 0.3, 0.1], [0.9, 0.9, 0.9]);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = checkerTexture;

  objects.add(new Sphere([0, -10, 0], 10, sphereMaterial));
  objects.add(new Sphere([0, 10, 0], 10, sphereMaterial));

  return objects;
}

export function twoPerlinSpheres(): HittableList {
  const objects = new HittableList();

  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;

  objects.add(new Sphere([0, -1000, 0], 1000, sphereMaterial));
  objects.add(new Sphere([0, 2, 0], 2, sphereMaterial));

  return objects;
}

export async function earthSphere(): Promise<HittableList> {
  const objects = new HittableList();

  const earthTexture = new ImageTexture();
  await earthTexture.load('assets/textures/earthmap.jpg');

  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = earthTexture;

  objects.add(new Sphere([0, 0, 0], 2, sphereMaterial));

  return objects;
}

export function randomScene(): HittableList {
  const world = new HittableList();

  //const groundMaterial = new LambertianMaterial([0.5, 0.5, 0.5));
  const checkerTexture = new CheckerTexture([0.2, 0.3, 0.1], [0.9, 0.9, 0.9]);
  const groundMaterial = new LambertianMaterial();
  groundMaterial.texture = checkerTexture;

  world.add(new Sphere([0, -1000, 0], 1000, groundMaterial));
  // let i = 1;
  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      //console.log(`${i++}`);
      const chooseMat = randomNumber();
      const center: Vec3 = [a + 0.9 * randomNumber(), 0.2, b + 0.9 * randomNumber()];

      if (Vector.length(Vector.subVec3(center, [4, 0.2, 0])) > 0.9) {
        let sphereMaterial: Material;

        if (chooseMat < 0.8) {
          // diffuse aka lambertian
          const albedo = Vector.multVec3(Vector.random(), Vector.random());
          sphereMaterial = new LambertianMaterial(albedo);
          //const center2 = Vec3.addVec3(center, [0, randomNumberRange(0, 0.5), 0));
          //world.add(new MovingSphere(center, center2, 0.0, 1.0, 0.2, sphereMaterial));
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else if (chooseMat < 0.95) {
          // metal
          const albedo = Vector.randomRange(0.5, 1);
          const roughness = randomNumberRange(0, 0.5);
          sphereMaterial = new MetalMaterial(albedo, roughness);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else {
          // glass
          sphereMaterial = new DielectricMaterial(1.5);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }

  const material1 = new DielectricMaterial(1.5);
  const material2 = new LambertianMaterial([0.4, 0.2, 0.1]);
  const material3 = new MetalMaterial([0.7, 0.6, 0.5], 0.0);

  world.add(new Sphere([1, 1, 0], 1, material1));
  world.add(new Sphere([-4, 1, 0], 1, material2));
  world.add(new Sphere([4, 1, 0], 1, material3));

  return world;
  //return new HittableList(BVHNode.createFromHitableList(world));
}

export function simpleLight(): HittableList {
  const objects = new HittableList();
  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;

  objects.add(new Sphere([0, -1000, 0], 1000, sphereMaterial));
  objects.add(new Sphere([0, 2, 0], 2, sphereMaterial));

  const diffuseLight = new DiffuseLight([4, 4, 4]);
  objects.add(new XYRect(3, 5, 1, 3, -2, diffuseLight));
  objects.add(new Sphere([0, 7, 0], 2, diffuseLight));

  return objects;
}

export function cornellBox(): HittableList {
  // http://www.graphics.cornell.edu/online/box/data.html
  const objects = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);

  objects.add(new YZRect(0, 555, 0, 555, 555, red)); // left wall
  objects.add(new YZRect(0, 555, 0, 555, 0, green)); // right wall
  objects.add(new XZRect(213, 343, 227, 332, 554, light)); // light
  objects.add(new XZRect(0, 555, 0, 555, 0, white)); // floor
  objects.add(new XZRect(0, 555, 0, 555, 555, white)); // ceiling
  objects.add(new XYRect(0, 555, 0, 555, 555, white)); // back wall

  let box1: Hittable;
  box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, [265, 0, 295]);
  objects.add(box1);

  let box2: Hittable;
  box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, [130, 0, 65]);
  objects.add(box2);

  return objects;
}

export function cornellBoxSmoke(): HittableList {
  // http://www.graphics.cornell.edu/online/box/data.html
  const objects = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);

  objects.add(new YZRect(0, 555, 0, 555, 555, red)); // left wall
  objects.add(new YZRect(0, 555, 0, 555, 0, green)); // right wall
  objects.add(new XZRect(213, 343, 227, 332, 554, light)); // light
  objects.add(new XZRect(0, 555, 0, 555, 0, white)); // floor
  objects.add(new XZRect(0, 555, 0, 555, 555, white)); // ceiling
  objects.add(new XYRect(0, 555, 0, 555, 555, white)); // back wall

  let box1: Hittable;
  box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, [265, 0, 295]);
  objects.add(new ConstantMedium(box1, 0.01, [0, 0, 0]));

  let box2: Hittable;
  box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, [130, 0, 65]);
  objects.add(new ConstantMedium(box2, 0.01, [1, 1, 1]));

  return objects;
}
