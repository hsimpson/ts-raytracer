import { CameraOptions } from './camera';
import { XYRect, XZRect, YZRect } from './raytracer-cpu/aarect';
import Box from './raytracer-cpu/box';
import BVHNode from './raytracer-cpu/bvhnode';
import { ConstantMedium } from './raytracer-cpu/constantmedium';
import DielectricMaterial from './raytracer-cpu/dielectric';
import DiffuseLight from './raytracer-cpu/diffuselight';
import { Hittable } from './raytracer-cpu/hittable';
import { HittableList } from './raytracer-cpu/hittablelist';
import LambertianMaterial from './raytracer-cpu/lambertian';
import Material from './raytracer-cpu/material';
import MetalMaterial from './raytracer-cpu/metal';
import MovingSphere from './raytracer-cpu/movingsphere';
import { RotateY } from './raytracer-cpu/rotation';
import { Sphere } from './raytracer-cpu/sphere';
import { CheckerTexture, ImageTexture, NoiseTexture } from './raytracer-cpu/texture';
import Translate from './raytracer-cpu/translate';
import { randomNumber, randomNumberRange } from './util';
import type { Vec3 } from './vec3';
import * as Vector from './vec3';

const defaultCameraOptions: CameraOptions = {
  lookFrom: [0, 0, 5],
  lookAt: [0, 0, 0],
  vUp: [0, 1, 0],
  background: [0.7, 0.8, 1.0],
  focusDist: 10,
  aperture: 0.0,
  fovY: 40,
};

// function gpuTestScene(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
//   const objects = new HittableList();

//   // ground
//   // const red = new LambertianMaterial([0.65, 0.05, 0.05]);
//   const groundMaterial = new LambertianMaterial([0.5, 0.5, 0.5]);
//   objects.add(new Sphere([0, -1000, 0], 1000, groundMaterial));

//   // const greenLambert = new LambertianMaterial([0.12, 0.45, 0.15]);
//   const metal1 = new MetalMaterial([0.7, 0.6, 0.5], 0.1);
//   const dielectric1 = new DielectricMaterial(1.5);

//   objects.add(new Sphere([-0.6, 0.4, 0], 0.4, metal1));
//   objects.add(new Sphere([0.6, 0.4, 0], 0.4, dielectric1));

//   // dummy ;-)
//   // const checkerTexture = new CheckerTexture([0.2, 0.3, 0.1], [0.9, 0.9, 0.9]);

//   return objects;
// }

async function randomScene(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();

  const groundMaterial = new LambertianMaterial([0.5, 0.5, 0.5]);
  // const checkerTexture = new CheckerTexture(new Vec3(0.2, 0.3, 0.1), new Vec3(0.9, 0.9, 0.9));
  // const groundMaterial = new LambertianMaterial();
  // groundMaterial.texture = checkerTexture;

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
          // const center2 = Vector.addVec3(center, [0, randomNumberRange(0, 0.5), 0]);
          // world.add(new MovingSphere(center, center2, 0.0, 1.0, 0.2, sphereMaterial));
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

  // return new HittableList(BVHNode.createFromHitableList(world, 0.0, 1.0));

  const cameraOptions: CameraOptions = { ...defaultCameraOptions, lookFrom: [13, 2, 3], fovY: 20 };

  return { world, cameraOptions };
}

async function twoSpheres(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();

  const checkerTexture = new CheckerTexture([0.2, 0.3, 0.1], [0.9, 0.9, 0.9]);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = checkerTexture;

  world.add(new Sphere([0, -10, 0], 10, sphereMaterial));
  world.add(new Sphere([0, 10, 0], 10, sphereMaterial));

  const cameraOptions: CameraOptions = { ...defaultCameraOptions, lookFrom: [13, 2, 3], fovY: 20 };

  return { world, cameraOptions };
}

async function twoPerlinSpheres(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();

  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;

  world.add(new Sphere([0, -1000, 0], 1000, sphereMaterial));
  world.add(new Sphere([0, 2, 0], 2, sphereMaterial));

  const cameraOptions: CameraOptions = { ...defaultCameraOptions, lookFrom: [13, 2, 3], fovY: 20 };

  return { world, cameraOptions };
}

async function earthSphere(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();

  const earthTexture = new ImageTexture();
  await earthTexture.load('assets/textures/earthmap.jpg');

  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = earthTexture;

  world.add(new Sphere([0, 0, 0], 2, sphereMaterial));

  const cameraOptions: CameraOptions = { ...defaultCameraOptions, lookFrom: [13, 2, 3], fovY: 20 };

  return { world, cameraOptions };
}

async function simpleLight(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();
  const perlinTexture = new NoiseTexture(4);
  const sphereMaterial = new LambertianMaterial();
  sphereMaterial.texture = perlinTexture;

  world.add(new Sphere([0, -1000, 0], 1000, sphereMaterial));
  world.add(new Sphere([0, 2, 0], 2, sphereMaterial));

  const diffuseLight = new DiffuseLight([4, 4, 4]);
  world.add(new XYRect(3, 5, 1, 3, -2, diffuseLight));
  world.add(new Sphere([0, 7, 0], 2, diffuseLight));

  const cameraOptions: CameraOptions = {
    ...defaultCameraOptions,
    lookFrom: [26, 3, 6],
    lookAt: [0, 2, 0],
    background: [0, 0, 0],
    fovY: 20,
  };

  return { world, cameraOptions };
}

async function cornellBox(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  // http://www.graphics.cornell.edu/online/box/data.html
  const world = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);

  world.add(new YZRect(0, 555, 0, 555, 555, red)); // left wall
  world.add(new YZRect(0, 555, 0, 555, 0, green)); // right wall
  world.add(new XZRect(213, 343, 227, 332, 554, light)); // light
  world.add(new XZRect(0, 555, 0, 555, 0, white)); // floor
  world.add(new XZRect(0, 555, 0, 555, 555, white)); // ceiling
  world.add(new XYRect(0, 555, 0, 555, 555, white)); // back wall

  let box1: Hittable;
  box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, [265, 0, 295]);
  world.add(box1);

  let box2: Hittable;
  box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, [130, 0, 65]);
  world.add(box2);

  const cameraOptions: CameraOptions = {
    ...defaultCameraOptions,
    lookFrom: [278, 278, -800],
    lookAt: [278, 278, 0],
    background: [0, 0, 0],
  };

  return { world, cameraOptions };
}

async function cornellBoxSmoke(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  // http://www.graphics.cornell.edu/online/box/data.html
  const world = new HittableList();
  const red = new LambertianMaterial([0.65, 0.05, 0.05]);
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  const green = new LambertianMaterial([0.12, 0.45, 0.15]);
  const light = new DiffuseLight([15, 15, 15]);

  world.add(new YZRect(0, 555, 0, 555, 555, red)); // left wall
  world.add(new YZRect(0, 555, 0, 555, 0, green)); // right wall
  world.add(new XZRect(213, 343, 227, 332, 554, light)); // light
  world.add(new XZRect(0, 555, 0, 555, 0, white)); // floor
  world.add(new XZRect(0, 555, 0, 555, 555, white)); // ceiling
  world.add(new XYRect(0, 555, 0, 555, 555, white)); // back wall

  let box1: Hittable;
  box1 = new Box([0, 0, 0], [165, 330, 165], white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, [265, 0, 295]);
  world.add(new ConstantMedium(box1, 0.01, [0, 0, 0]));

  let box2: Hittable;
  box2 = new Box([0, 0, 0], [165, 165, 165], white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, [130, 0, 65]);
  world.add(new ConstantMedium(box2, 0.01, [1, 1, 1]));

  const cameraOptions: CameraOptions = {
    ...defaultCameraOptions,
    lookFrom: [278, 278, -800],
    lookAt: [278, 278, 0],
    background: [0, 0, 0],
  };

  return { world, cameraOptions };
}

async function finalScene(): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const world = new HittableList();
  const boxes1 = new HittableList();

  const ground = new LambertianMaterial([0.48, 0.83, 0.53]);

  const boxesPerSide = 20;
  const w = 100.0;
  const y0 = 0.0;

  for (let i = 0; i < boxesPerSide; i++) {
    for (let j = 0; j < boxesPerSide; j++) {
      const x0 = -1000.0 + i * w;
      const z0 = -1000.0 + j * w;
      const x1 = x0 + w;
      const y1 = randomNumberRange(1, 101);
      const z1 = z0 + w;

      boxes1.add(new Box([x0, y0, z0], [x1, y1, z1], ground));
    }
  }

  //objects.add(boxes1);
  world.add(BVHNode.createFromHitableList(boxes1, 0, 1));

  const light = new DiffuseLight([7, 7, 7]);
  world.add(new XZRect(123, 423, 147, 412, 554, light));

  const center1: Vec3 = [400, 400, 200];
  const center2 = Vector.addVec3(center1, [30, 0, 0]);
  const movingSphereMaterial = new LambertianMaterial([0.7, 0.3, 0.1]);
  world.add(new MovingSphere(center1, center2, 0, 1, 50, movingSphereMaterial));

  world.add(new Sphere([260, 150, 45], 50, new DielectricMaterial(1.5)));
  world.add(new Sphere([0, 150, 145], 50, new MetalMaterial([0.8, 0.8, 0.9], 10.0)));

  const boundary1 = new Sphere([360, 150, 145], 70, new DielectricMaterial(1.5));
  world.add(boundary1);
  world.add(new ConstantMedium(boundary1, 0.2, [0.2, 0.4, 0.9]));
  const boundary2 = new Sphere([0, 0, 0], 5000, new DielectricMaterial(1.5));
  world.add(new ConstantMedium(boundary2, 0.0001, [1, 1, 1]));

  const earthTexture = new ImageTexture();
  await earthTexture.load('assets/textures/earthmap.jpg');

  const earthMaterial = new LambertianMaterial();
  earthMaterial.texture = earthTexture;
  world.add(new Sphere([400, 200, 400], 100, earthMaterial));

  const perlinTexture = new NoiseTexture(0.1);
  const perlinMaterial = new LambertianMaterial();
  perlinMaterial.texture = perlinTexture;
  world.add(new Sphere([220, 280, 300], 80, perlinMaterial));

  const boxes2 = new HittableList();
  const white = new LambertianMaterial([0.73, 0.73, 0.73]);
  for (let j = 0; j < 1000; j++) {
    boxes2.add(new Sphere(Vector.randomRange(0, 165), 10, white));
  }

  //objects.add(new Translate(new RotateY(boxes2, 15), [-100, 270, 395)));
  world.add(new Translate(new RotateY(BVHNode.createFromHitableList(boxes2, 0, 1), 15), [-100, 270, 395]));

  const cameraOptions: CameraOptions = {
    ...defaultCameraOptions,
    lookFrom: [478, 278, -600],
    lookAt: [278, 278, 0],
    background: [0, 0, 0],
  };
  return { world, cameraOptions };
}

const sceneCreators = [
  randomScene,
  twoSpheres,
  twoPerlinSpheres,
  earthSphere,
  simpleLight,
  cornellBox,
  cornellBoxSmoke,
  finalScene,
];

export async function getScene(sceneIndex: number): Promise<{ world: HittableList; cameraOptions: CameraOptions }> {
  const { world, cameraOptions } = await sceneCreators[sceneIndex]();
  return { world, cameraOptions };
}