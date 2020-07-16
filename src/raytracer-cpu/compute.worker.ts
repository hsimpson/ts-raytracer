import { Deserialize, InstantiationMethod } from 'cerializr';
import Camera from './camera';
import { HittableList } from './hittablelist';
import { rayColor } from './ray';
import { randomNumber } from '../util';
import Vec3 from '../vec3';
import { ComputeCommands, ComputeEndMessage, ComputeStartMessage, WorkerMessage } from './workerinterfaces';

const _controllerCtx: Worker = self as never;
let _id: number;

const writeColor = (array: Uint8ClampedArray, offset: number, color: Vec3, ssp: number): void => {
  let r = color.r;
  let g = color.g;
  let b = color.b;

  // Divide the color total by the number of samples and gamma-correct for gamma=2.0.
  const scale = 1.0 / ssp;
  r = Math.sqrt(scale * r);
  g = Math.sqrt(scale * g);
  b = Math.sqrt(scale * b);

  // Write the translated [0,255] value of each color component.
  array[offset++] = r * 255;
  array[offset++] = g * 255;
  array[offset++] = b * 255;
};

const start = (msg: ComputeStartMessage): void => {
  _id = msg.data.workerId;
  const camera = Deserialize(msg.data.camera, Camera, null, InstantiationMethod.ObjectCreate);
  // debugger;
  const world = Deserialize(msg.data.world, HittableList, null, InstantiationMethod.ObjectCreate);
  const imageWidth = msg.data.imageWidth;
  const imageHeight = msg.data.imageHeight;
  const scanlineCount = msg.data.scanlineCount;
  const startLine = msg.data.startLine;
  const ssp = msg.data.samplesPerPixel;
  const maxBounces = msg.data.maxBounces;

  console.log(`worker[${_id}] startLine: ${startLine}`);
  console.log(`worker[${_id}] linecount: ${scanlineCount}`);

  const dataArray = new Uint8ClampedArray(imageWidth * scanlineCount * 3);

  let offset = 0;
  const endLine = startLine + scanlineCount;
  for (let j = startLine; j < endLine; j++) {
    console.log(`worker[${_id}] scanlines remaining ${endLine - j}`);
    for (let i = 0; i < imageWidth; i++) {
      let pixelColor = new Vec3(0, 0, 0);

      for (let s = 0; s < ssp; s++) {
        //pixelColor = randomColor;
        const u = (i + randomNumber()) / (imageWidth - 1);
        const v = (j + randomNumber()) / (imageHeight - 1);

        const r = camera.getRay(u, v);
        pixelColor = Vec3.addVec3(pixelColor, rayColor(r, world, maxBounces));
      }

      writeColor(dataArray, offset, pixelColor, ssp);
      offset += 3;
    }
  }

  const computeEndMessage: ComputeEndMessage = {
    cmd: ComputeCommands.END,
    data: {
      workerId: _id,
      pixelArray: dataArray,
      startLine,
      scanlineCount,
    },
  };
  _controllerCtx.postMessage(computeEndMessage);
};

// Respond to message from parent thread
_controllerCtx.addEventListener('message', (event) => {
  const msg = event.data as WorkerMessage;

  switch (msg.cmd) {
    case ComputeCommands.START:
      start(msg as ComputeStartMessage);
      break;

    default:
      break;
  }
});
