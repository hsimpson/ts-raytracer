import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 400,
    imageHeight: 300,
    samplesPerPixel: 1,
    maxBounces: 50,
    numOfWorkers: 1,
    webGPUavailable: false,
    webGPUenabled: false,
  },
});

export const StartRendering = atom({
  key: 'startRendering',
  default: false,
});
