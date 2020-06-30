import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 640,
    imageHeight: 360,
    samplesPerPixel: 5,
    maxBounces: 20,
  },
});

export const StartRendering = atom({
  key: 'startRendering',
  default: false,
});
