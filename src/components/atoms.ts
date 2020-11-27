import { atom } from 'recoil';

export const RaytracerProperties = atom({
  key: 'raytracerProperties',
  default: {
    imageWidth: 640,
    imageHeight: 360,
    samplesPerPixel: 20,
    maxBounces: 50,
    numOfWorkers: navigator.hardwareConcurrency,
    // numOfWorkers: 1,
    webGPUavailable: false,
    webGPUenabled: false,
    download: false,
    addStatsToImage: false,
    scene: 0,
  },
});

export const RaytracerRunningState = atom({
  key: 'raytracerState',
  default: {
    isRunning: false,
    stats: '',
  },
});
