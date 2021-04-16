import { Camera } from '../camera';
import { deserialize } from '../serializing/deserialize';
import { randomNumber, writeColor } from '../util';
import { vec3 } from 'gl-matrix';
import { DeserializerMap } from './deserializermap';
import { HittableList } from '../hittables';
import { rayColor } from './ray';
import { ComputeCommands, ComputeEndMessage, ComputeStartMessage, WorkerMessage } from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;
const _controllerCtx: Worker = self as never;
// let _id: number;

function start(msg: ComputeStartMessage): void {
  const workerId = msg.data.workerId;
  const x = msg.data.x;
  const y = msg.data.y;
  const width = msg.data.width;
  const height = msg.data.height;

  console.log(`worker[${workerId}]: start(x:${x}, y:${y}, w:${width}, h:${height})`);
  const camera = deserialize(Camera, msg.data.camera);
  const world = deserialize(HittableList, msg.data.world);
  const background = msg.data.background;
  const imageWidth = msg.data.imageWidth;
  const imageHeight = msg.data.imageHeight;
  const spp = msg.data.samplesPerPixel;
  const maxBounces = msg.data.maxBounces;

  const dataArray = new Uint8ClampedArray(width * height * 3);

  let offset = 0;

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const pixelColor = vec3.create();

      for (let s = 0; s < spp; s++) {
        // const rnd = sampleOffsets[s];
        const u = (i + x + randomNumber()) / (imageWidth - 1);
        const v = (j + y + randomNumber()) / (imageHeight - 1);
        // const u = (i + rnd) / (imageWidth - 1);
        // const v = (j + rnd) / (imageHeight - 1);

        const r = camera.getRay(u, v);
        vec3.add(pixelColor, pixelColor, rayColor(r, background, world, maxBounces));
      }

      writeColor(dataArray, offset, pixelColor, spp);
      offset += 3;
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

  console.log(`worker[${msg.data.workerId}]: finish`);
  _controllerCtx.postMessage(computeEndMessage);
}

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
