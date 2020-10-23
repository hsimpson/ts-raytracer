import { Camera } from '../camera';
import { deserialize } from '../serializing/deserialize';
import { randomNumber } from '../util';
import type { Vec3 } from '../vec3';
import * as Vector from '../vec3';
import { DeserializerMap } from './deserializermap';
import { HittableList } from './hittablelist';
import { rayColor } from './ray';
import { ComputeCommands, ComputeEndMessage, ComputeStartMessage, WorkerMessage } from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;
const _controllerCtx: Worker = self as never;
let _id: number;

const writeColor = (array: Uint8ClampedArray, offset: number, color: Vec3, ssp: number): void => {
  let [r, g, b] = color;

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
  const camera = deserialize(Camera, msg.data.camera);
  const world = deserialize(HittableList, msg.data.world);
  const background = msg.data.background;
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
  const endLine = startLine + 1 - scanlineCount;
  let linesToCalc = scanlineCount;

  // const sampleOffsets = [];
  // for (let sample = 0; sample < ssp; sample++) {
  //   sampleOffsets.push(randomNumber());
  // }

  for (let j = startLine; j >= endLine; j--) {
    console.log(`worker[${_id}] scanlines remaining ${linesToCalc--}`);
    for (let i = 0; i < imageWidth; i++) {
      let pixelColor: Vec3 = [0, 0, 0];

      for (let s = 0; s < ssp; s++) {
        // const rnd = sampleOffsets[s];
        const u = (i + randomNumber()) / (imageWidth - 1);
        const v = (j + randomNumber()) / (imageHeight - 1);
        // const u = (i + rnd) / (imageWidth - 1);
        // const v = (j + rnd) / (imageHeight - 1);

        const r = camera.getRay(u, v);
        pixelColor = Vector.addVec3(pixelColor, rayColor(r, background, world, maxBounces));
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
