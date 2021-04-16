import ComputeWorker from 'worker-loader!./compute.worker';
import { Camera } from '../camera';
import { HittableList } from '../hittables';
import { deserialize, serialize } from '../serializing';
import { ComputeTile, createComputeTiles } from '../tiles';
import { DeserializerMap } from './deserializermap';
import {
  ComputeCommands,
  ComputeEndMessage,
  ComputeStartMessage,
  ControllerCommands,
  ControllerEndMessage,
  ControllerStartMessage,
  ControllerUpdateMessage,
  WorkerMessage,
} from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;

const _controllerCtx: Worker = self as never;
const _computeWorkers: Map<number, ComputeWorker> = new Map<number, ComputeWorker>();
let _pixelArray: Uint8ClampedArray;

const start = (msg: ControllerStartMessage): void => {
  const imageWidth = msg.data.imageWidth;
  const imageHeight = msg.data.imageHeight;
  const samplesPerPixel = msg.data.samplesPerPixel;
  const maxBounces = msg.data.maxBounces;
  const tileSize = msg.data.tileSize;
  const computeTiles: ComputeTile[] = createComputeTiles(imageWidth, imageHeight, tileSize);

  _pixelArray = new Uint8ClampedArray(imageWidth * imageHeight * 3);

  const world = deserialize(HittableList, msg.data.world);
  const camera = deserialize(Camera, msg.data.camera);

  const workerIsDone = (msg: ComputeEndMessage): void => {
    const workerArray = msg.data.pixelArray;

    let dataOffset = 0;
    let imageOffset = (msg.data.y * imageWidth + msg.data.x) * 3;
    // let imageOffset = (_imageHeight - (msg.data.y + 1)) * _imageWidth * 3;
    // let imageOffset = _imageHeight - (msg.data.y*)

    for (let j = 0; j < msg.data.height; j++) {
      for (let i = 0; i < msg.data.width; i++) {
        _pixelArray[imageOffset++] = workerArray[dataOffset++];
        _pixelArray[imageOffset++] = workerArray[dataOffset++];
        _pixelArray[imageOffset++] = workerArray[dataOffset++];
      }
      imageOffset += (imageWidth - msg.data.width) * 3;
    }

    const controllerUpdateMessage: ControllerUpdateMessage = {
      cmd: ControllerCommands.UPDATE,
      data: {
        imageArray: _pixelArray,
      },
    };
    _controllerCtx.postMessage(controllerUpdateMessage);
  };

  const onMessageFromComputeWorker = (event: MessageEvent): void => {
    const workerMsg = event.data as WorkerMessage;

    switch (workerMsg.cmd as ComputeCommands) {
      case ComputeCommands.END: {
        const endMsg = workerMsg as ComputeEndMessage;
        workerIsDone(endMsg);

        if (computeTiles.length) {
          startComputeWorker(endMsg.data.workerId);
        } else {
          stopWorker(endMsg.data.workerId); // no more tiles to render
        }
        break;
      }

      default:
        break;
    }
  };

  const startComputeWorker = (workerId: number): void => {
    const worker = _computeWorkers.get(workerId);
    const tile = computeTiles.shift();

    const computeStartMessage: ComputeStartMessage = {
      cmd: ComputeCommands.START,
      data: {
        workerId,
        camera: serialize(Camera, camera),
        world: serialize(HittableList, world),
        background: msg.data.background,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        samplesPerPixel: samplesPerPixel,
        maxBounces: maxBounces,
        ...tile,
      },
    };
    worker.postMessage(computeStartMessage);
  };

  // starting all workers
  for (let workerId = 0; workerId < msg.data.computeWorkers; workerId++) {
    const computeWorker = new ComputeWorker();
    computeWorker.onmessage = onMessageFromComputeWorker;
    _computeWorkers.set(workerId, computeWorker);

    startComputeWorker(workerId);

    if (computeTiles.length === 0) {
      break;
    }
  }
};

const stopWorker = (id: number): void => {
  _computeWorkers.get(id).terminate();
  _computeWorkers.delete(id);

  if (_computeWorkers.size === 0) {
    const controllerEndMessage: ControllerEndMessage = {
      cmd: ControllerCommands.END,
      data: {
        imageArray: _pixelArray,
      },
    };
    _controllerCtx.postMessage(controllerEndMessage);
  }
};

const stop = (): void => {
  console.log('controller stop');

  // stop the compute workers
  for (const [id, computeWorker] of _computeWorkers) {
    computeWorker.terminate();
    _computeWorkers.delete(id);
  }

  const controllerEndMessage: ControllerEndMessage = {
    cmd: ControllerCommands.END,
    data: {
      imageArray: _pixelArray,
    },
  };
  _controllerCtx.postMessage(controllerEndMessage);
};

// Respond to message from parent thread
_controllerCtx.addEventListener('message', (event) => {
  const msg = event.data as WorkerMessage;

  switch (msg.cmd as ControllerCommands) {
    case ControllerCommands.START:
      start(msg as ControllerStartMessage);
      break;
    case ControllerCommands.STOP:
      stop();
      break;

    default:
      break;
  }
});
