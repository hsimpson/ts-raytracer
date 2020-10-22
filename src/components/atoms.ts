import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 400,
    imageHeight: 300,
    samplesPerPixel: 1,
    maxBounces: 50,
    numOfWorkers: navigator.hardwareConcurrency,
    webGPUavailable: false,
    webGPUenabled: false,
    scene: 0,
  },
});

export const StartRendering = atom({
  key: 'startRendering',
  default: false,
});
