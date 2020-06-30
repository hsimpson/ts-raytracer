import Camera from './camera';
import DielectricMaterial from './dielectric';
import { HittableList } from './hittablelist';
import LambertianMaterial from './lambertian';
import MetalMaterial from './metal';
import { rayColor } from './ray';
import Sphere from './sphere';
import { randomNumber, randomNumberRange } from './util';
import Vec3, { writeColor } from './vec3';
import Material from './material';

export default class Raytracer {
  private _isRunning = false;
  private _imageWidth: number;
  private _imageHeight: number;
  private _samplesPerPixel: number;
  private _maxBounces: number;
  private _onScreenCanvas: HTMLCanvasElement;

  private _context2D: CanvasRenderingContext2D;
  private _world: HittableList;

  public constructor(
    canvas: HTMLCanvasElement,
    imageWidth: number,
    imageHeight: number,
    samplesPerPixel: number,
    maxBounces: number
  ) {
    this._onScreenCanvas = canvas;
    this._imageWidth = imageWidth;
    this._imageHeight = imageHeight;
    this._samplesPerPixel = samplesPerPixel;
    this._maxBounces = maxBounces;

    this._context2D = this._onScreenCanvas.getContext('2d');
    /*
    this._world = new HittableList();

    //this._world.add(new Sphere(new Vec3(0, 0, -1), 0.5, new DielectricMaterial(1.5)));
    this._world.add(new Sphere(new Vec3(0, 0, -1), 0.5, new LambertianMaterial(new Vec3(0.1, 0.2, 0.5))));
    this._world.add(new Sphere(new Vec3(0, -100.5, -1), 100, new LambertianMaterial(new Vec3(0.8, 0.8, 0))));

    this._world.add(new Sphere(new Vec3(1, 0, -1), 0.5, new MetalMaterial(new Vec3(0.8, 0.6, 0.2), 0.3)));
    //this._world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, new MetalMaterial(new Vec3(0.8, 0.8, 0.8), 0.1)));
    this._world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, new DielectricMaterial(1.5)));

    // negative radius sphere in other sphere to mimic a bubble effect
    //this._world.add(new Sphere(new Vec3(-1, 0, -1), -0.45, new DielectricMaterial(1.5)));
    */
  }

  public randomScene(): HittableList {
    const world = new HittableList();

    const groundMaterial = new LambertianMaterial(new Vec3(0.5, 0.5, 0.5));
    world.add(new Sphere(new Vec3(0, -1000, 0), 1000, groundMaterial));

    for (let a = -11; a < 11; a++) {
      for (let b = -11; b < 11; b++) {
        const chooseMat = randomNumber();
        const center = new Vec3(a + 0.9 * randomNumber(), 0.2, b + 0.9 * randomNumber());

        if (Vec3.subVec3(center, new Vec3(4, 0.2, 0)).length() > 0.9) {
          let sphereMaterial: Material;

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

  public start(): void {
    this._world = this.randomScene();
    this._isRunning = true;
    const aspectRatio = this._imageWidth / this._imageHeight;
    const lookFrom = new Vec3(13, 2, 3);
    const lookAt = new Vec3(0, 0, 0);
    const vUp = new Vec3(0, 1, 0);
    //const distToFocus = Vec3.subVec3(lookFrom, lookAt).length();
    const distToFocus = 10;
    const aperture = 0.1;

    const cam = new Camera(lookFrom, lookAt, vUp, 20, aspectRatio, aperture, distToFocus);
    const imageData = this._context2D.createImageData(this._imageWidth, this._imageHeight);
    let offset = 0;
    const start = performance.now();
    for (let j = this._imageHeight - 1; j >= 0; --j) {
      console.log(`Scanlines remaining ${j}`);
      for (let i = 0; i < this._imageWidth; i++) {
        let pixel_color = new Vec3(0, 0, 0);

        for (let s = 0; s < this._samplesPerPixel; s++) {
          const u = (i + randomNumber()) / (this._imageWidth - 1);
          const v = (j + randomNumber()) / (this._imageHeight - 1);

          const r = cam.getRay(u, v);
          pixel_color = Vec3.addVec3(pixel_color, rayColor(r, this._world, this._maxBounces));
        }

        writeColor(imageData.data, offset, pixel_color, this._samplesPerPixel);
        offset += 4;
      }
    }
    const end = performance.now();
    console.log(`duration=${(end - start).toFixed(3)}ms`);

    this._context2D.putImageData(imageData, 0, 0);
  }
  public stop(): void {
    this._isRunning = false;
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public set imageWidth(imageWidth: number) {
    this._imageWidth = imageWidth;
  }

  public set imageHeight(imageHeight: number) {
    this._imageHeight = imageHeight;
  }

  public set samplesPerPixel(samplesPerPixel: number) {
    this._samplesPerPixel = samplesPerPixel;
  }

  public set maxBounces(maxBounces: number) {
    this._maxBounces = maxBounces;
  }
}
