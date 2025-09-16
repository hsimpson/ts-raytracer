import { useAtom } from 'jotai';
import React from 'react';
import { RaytracerGPU, RayTracerGPUOptions } from '../raytracer-gpu/raytracergpu';
import { raytracerProperties, raytracerRunningProperties } from './atoms';

const Canvas = (): React.ReactElement => {
  const canvasGPURef = React.useRef<HTMLCanvasElement>(null);
  const [raytracerState] = useAtom(raytracerProperties);
  const [raytracerRunningState, setRaytracerRunningState] = useAtom(raytracerRunningProperties);
  const rayTracerGPURef = React.useRef<RaytracerGPU>(null);

  const onRayTracerDone = (stats: string): void => {
    setRaytracerRunningState({ ...raytracerRunningState, isRunning: false, stats });
  };

  React.useEffect(() => {
    const options: Omit<RayTracerGPUOptions, 'canvas'> = {
      imageWidth: raytracerState.imageWidth,
      imageHeight: raytracerState.imageHeight,
      samplesPerPixel: raytracerState.samplesPerPixel,
      maxBounces: raytracerState.maxBounces,
      scene: raytracerState.scene,
      download: raytracerState.download,
      addStatsToImage: raytracerState.addStatsToImage,
      tileSize: raytracerState.tileSize,
    };

    if (!canvasGPURef.current) {
      return;
    }

    // create GPU raytracer
    rayTracerGPURef.current ??= new RaytracerGPU({ ...options, canvas: canvasGPURef.current });
    const raytracer = rayTracerGPURef.current;

    raytracer.imageWidth = raytracerState.imageWidth;
    raytracer.imageHeight = raytracerState.imageHeight;
    raytracer.samplesPerPixel = raytracerState.samplesPerPixel;
    raytracer.maxBounces = raytracerState.maxBounces;
    raytracer.scene = raytracerState.scene;
    raytracer.download = raytracerState.download;
    raytracer.addStatsToImage = raytracerState.addStatsToImage;
    raytracer.tileSize = raytracerState.tileSize;

    console.log('raytracerRunningState', raytracerRunningState);
    console.log('raytracer', raytracer);

    if (raytracerRunningState.isRunning && !raytracer.isRunning) {
      void raytracer.start(onRayTracerDone);
    } else if (!raytracerRunningState.isRunning && raytracer.isRunning) {
      raytracer.stop();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raytracerRunningState.isRunning]);

  const gpuCanvasClasses = 'canvas enabled';

  return (
    <div className="render-container">
      <div className="stats">
        <span>{`Render stats: ${raytracerRunningState.stats}`}</span>
      </div>
      <div className="canvas-container">
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
