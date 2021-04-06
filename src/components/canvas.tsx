import React from 'react';
import { useRecoilState } from 'recoil';
import { RaytracerCPU, RayTracerCPUOptions } from '../raytracer-cpu/raytracercpu';
import { RaytracerGPU, RayTracerGPUOptions } from '../raytracer-gpu/raytracergpu';
import { RaytracerProperties, RaytracerRunningState } from './atoms';

const Canvas = (): React.ReactElement => {
  const canvasCPURef = React.useRef<HTMLCanvasElement>(undefined);
  const canvasGPURef = React.useRef<HTMLCanvasElement>(undefined);
  const [raytracerState] = useRecoilState(RaytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = useRecoilState(RaytracerRunningState);

  const rayTracerCPURef = React.useRef<RaytracerCPU>(undefined);
  const rayTracerGPURef = React.useRef<RaytracerGPU>(undefined);

  const onRayTracerDone = (stats: string): void => {
    setRaytracerRunningState({ ...raytracerRunningState, isRunning: false, stats });
  };

  React.useEffect(() => {
    const options: Omit<RayTracerCPUOptions, 'canvas'> | Omit<RayTracerGPUOptions, 'canvas'> = {
      imageWidth: raytracerState.imageWidth,
      imageHeight: raytracerState.imageHeight,
      samplesPerPixel: raytracerState.samplesPerPixel,
      maxBounces: raytracerState.maxBounces,
      scene: raytracerState.scene,
      download: raytracerState.download,
      addStatsToImage: raytracerState.addStatsToImage,
    };

    // create CPU raytracer
    if (!rayTracerCPURef.current) {
      rayTracerCPURef.current = new RaytracerCPU({
        ...options,
        canvas: canvasCPURef.current,
        numOfWorkers: raytracerState.numOfWorkers,
      });
    }

    // create GPU raytracer
    if (RaytracerGPU.supportsWebGPU() && !rayTracerGPURef.current) {
      rayTracerGPURef.current = new RaytracerGPU({ ...options, canvas: canvasGPURef.current });
    }

    let raytracer: RaytracerCPU | RaytracerGPU;
    if (raytracerState.webGPUenabled) {
      raytracer = rayTracerGPURef.current;
    } else {
      raytracer = rayTracerCPURef.current;
      raytracer.numOfWorkers = raytracerState.numOfWorkers;
    }

    raytracer.imageWidth = raytracerState.imageWidth;
    raytracer.imageHeight = raytracerState.imageHeight;
    raytracer.samplesPerPixel = raytracerState.samplesPerPixel;
    raytracer.maxBounces = raytracerState.maxBounces;
    raytracer.scene = raytracerState.scene;
    raytracer.download = raytracerState.download;
    raytracer.addStatsToImage = raytracerState.addStatsToImage;

    if (raytracerRunningState.isRunning && !raytracer.isRunning) {
      void raytracer.start(onRayTracerDone);
    } else if (!raytracerRunningState.isRunning && raytracer.isRunning) {
      raytracer.stop();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raytracerRunningState.isRunning]);

  const cpuCanvasClasses = `canvas ${raytracerState.webGPUenabled ? '' : 'enabled'}`;
  const gpuCanvasClasses = `canvas ${raytracerState.webGPUenabled ? 'enabled' : ''}`;

  return (
    <div className="render-container">
      <div className="stats">
        <span>{`Render stats: ${raytracerRunningState.stats}`}</span>
      </div>
      <div className="canvas-container">
        <canvas
          id="canvas-cpu"
          className={cpuCanvasClasses}
          ref={canvasCPURef}
          width={raytracerState.imageWidth}
          height={raytracerState.imageHeight}
        />
        <canvas
          id="canvas-gpu"
          className={gpuCanvasClasses}
          ref={canvasGPURef}
          width={raytracerState.imageWidth}
          height={raytracerState.imageHeight}
        />
      </div>
    </div>
  );
};

export default Canvas;
