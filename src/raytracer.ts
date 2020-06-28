import { HittableList } from './hittablelist';
import Camera from './camera';
import Vec3, { writeColor } from './vec3';
import { ray_color } from './ray';
import Sphere from './sphere';
import { randomNumber } from './util';
import LambertianMaterial from './lambertian';
import MetalMaterial from './metal';

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
    this._world = new HittableList();
    this._world.add(new Sphere(new Vec3(0, 0, -1), 0.5, new LambertianMaterial(new Vec3(0.7, 0.3, 0.3))));
    this._world.add(new Sphere(new Vec3(0, -100.5, -1), 100, new LambertianMaterial(new Vec3(0.8, 0.8, 0))));

    this._world.add(new Sphere(new Vec3(1, 0, -1), 0.5, new MetalMaterial(new Vec3(0.8, 0.6, 0.2), 1.0)));
    this._world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, new MetalMaterial(new Vec3(0.8, 0.8, 0.8), 0.1)));
  }

  public start(): void {
    this._isRunning = true;
    const cam = new Camera(this._imageWidth, this._imageHeight);
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

          const r = cam.get_ray(u, v);
          pixel_color = Vec3.addVec3(pixel_color, ray_color(r, this._world, this._maxBounces));
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
