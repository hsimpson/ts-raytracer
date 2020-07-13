import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 960,
    imageHeight: 540,
    samplesPerPixel: 50,
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
