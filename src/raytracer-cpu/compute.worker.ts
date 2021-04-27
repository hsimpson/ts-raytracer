import { Camera } from '../camera';
import { deserialize } from '../serializing/deserialize';
import { randomNumber, writeColor } from '../util';
import { vec3 } from 'gl-matrix';
import { DeserializerMap } from './deserializermap';
import { HittableList } from '../hittables';
import { rayColor } from './ray';
import {
  ComputeCommands,
  ComputeEndMessage,
  ComputeInitMessage,
  ComputeReadyMessage,
  ComputeStartMessage,
  WorkerMessage,
} from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;
const controllerCtx: Worker = self as never;

let workerId: number;
let camera: Camera;
let world: HittableList;
let background: vec3;
let imageWidth: number;
let imageHeight: number;
let samplesPerPixel: number;
let maxBounces: number;

function init(msg: ComputeInitMessage): void {
  workerId = msg.data.workerId;
  camera = deserialize(Camera, msg.data.camera);
  world = deserialize(HittableList, msg.data.world);
  background = msg.data.background;
  imageWidth = msg.data.imageWidth;
  imageHeight = msg.data.imageHeight;
  samplesPerPixel = msg.data.samplesPerPixel;
  maxBounces = msg.data.maxBounces;

  const computeReadyMessage: ComputeReadyMessage = {
    cmd: ComputeCommands.READY,
    data: {
      workerId,
    },
  };
  controllerCtx.postMessage(computeReadyMessage);
}

function start(msg: ComputeStartMessage): void {
  const x = msg.data.x;
  const y = msg.data.y;
  const width = msg.data.width;
  const height = msg.data.height;

  // console.log(`worker[${workerId}]: start(x:${x}, y:${y}, w:${width}, h:${height})`);

  const dataArray = new Uint8ClampedArray(width * height * 4);

  let offset = 0;

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const pixelColor = vec3.create();

      for (let s = 0; s < samplesPerPixel; s++) {
        // const rnd = sampleOffsets[s];
        const u = (i + x + randomNumber()) / (imageWidth - 1);
        const v = (j + y + randomNumber()) / (imageHeight - 1);
        // const u = (i + rnd) / (imageWidth - 1);
        // const v = (j + rnd) / (imageHeight - 1);

        const r = camera.getRay(u, v);
        vec3.add(pixelColor, pixelColor, rayColor(r, background, world, maxBounces));
      }

      writeColor(dataArray, offset, pixelColor, samplesPerPixel);
      offset += 4;
    }
  }
  const computeEndMessage: ComputeEndMessage = {
    cmd: ComputeCommands.END,
    data: {
      workerId: workerId,
      pixelArray: dataArray,
      x,
      y,
      width,
      height,
    },
  };

  // console.log(`worker[${msg.data.workerId}]: finish`);
  controllerCtx.postMessage(computeEndMessage);
}

// Respond to message from parent thread
controllerCtx.addEventListener('message', (event) => {
  const msg = event.data as WorkerMessage;

  switch (msg.cmd) {
    case ComputeCommands.INIT:
      init(msg as ComputeInitMessage);
      break;
    case ComputeCommands.START:
      start(msg as ComputeStartMessage);
      break;

    default:
      break;
  }
});
