import React from 'react';
import { RaytracerProperties } from './atoms';
import { useRecoilState } from 'recoil';
import { StartRendering } from './atoms';
import Raytracer from '../raytracer';

const Canvas = (): React.ReactElement => {
  const canvasRef = React.useRef<HTMLCanvasElement>(undefined);
  const [raytracerState] = useRecoilState(RaytracerProperties);
  const [startRendering] = useRecoilState(StartRendering);
  const rayTracerRef = React.useRef<Raytracer>(undefined);

  React.useEffect(() => {
    if (!rayTracerRef.current) {
      rayTracerRef.current = new Raytracer(
        canvasRef.current,
        raytracerState.imageWidth,
        raytracerState.imageHeight,
        raytracerState.samplesPerPixel,
        raytracerState.maxBounces,
        raytracerState.numOfWorkers
      );
    } else {
      rayTracerRef.current.imageWidth = raytracerState.imageWidth;
      rayTracerRef.current.imageHeight = raytracerState.imageHeight;
      rayTracerRef.current.samplesPerPixel = raytracerState.samplesPerPixel;
      rayTracerRef.current.maxBounces = raytracerState.maxBounces;
      rayTracerRef.current.numOfWorkers = raytracerState.numOfWorkers;
    }
  }, [raytracerState]);

  React.useEffect(() => {
    if (!rayTracerRef.current) {
      rayTracerRef.current = new Raytracer(
        canvasRef.current,
        raytracerState.imageWidth,
        raytracerState.imageHeight,
        raytracerState.samplesPerPixel,
        raytracerState.maxBounces,
        raytracerState.numOfWorkers
      );
    }

    if (startRendering && !rayTracerRef.current.isRunning) {
      rayTracerRef.current.start();
    }

    /*
    else if (!startRendering && rayTracerRef.current.isRunning) {
      rayTracerRef.current.stop();
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRendering]);

  return (
    <div className="canvas_container">
      <canvas
        className="canvas"
        ref={canvasRef}
        width={raytracerState.imageWidth}
        height={raytracerState.imageHeight}></canvas>
    </div>
  );
};

export default Canvas;
