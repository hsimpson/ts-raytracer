import ComputeWorker from 'worker-loader!./compute.worker';
import { Camera } from '../camera';
import { deserialize, serialize } from '../serializing';
import { DeserializerMap } from './deserializermap';
import { HittableList } from '../hittables';
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

interface WorkerTile {
  x: number;
  y: number;
  width: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;

const _controllerCtx: Worker = self as never;
let _array: Uint8ClampedArray;
let _imageWidth: number;
let _imageHeight: number;
let _samplesPerPixel: number;
let _maxBounces: number;
let _tileSize: number;
const _computeWorkers: Map<number, ComputeWorker> = new Map<number, ComputeWorker>();
const _workerTiles: WorkerTile[] = [];

const start = (msg: ControllerStartMessage): void => {
  _imageWidth = msg.data.imageWidth;
  _imageHeight = msg.data.imageHeight;
  _samplesPerPixel = msg.data.samplesPerPixel;
  _maxBounces = msg.data.maxBounces;
  _tileSize = msg.data.tileSize;

  _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);

  const world = deserialize(HittableList, msg.data.world);
  const camera = deserialize(Camera, msg.data.camera);

  // create the workerPositions
  for (let y = 0; y < _imageHeight; y += _tileSize) {
    for (let x = 0; x < _imageWidth; x += _tileSize) {
      _workerTiles.push({
        x,
        y,
        width: x + _tileSize < _imageWidth ? _tileSize : _imageWidth - x,
        height: y + _tileSize < _imageHeight ? _tileSize : _imageHeight - y,
      });
    }
  }

  const workerIsDone = (msg: ComputeEndMessage): void => {
    const workerArray = msg.data.pixelArray;

    let dataOffset = 0;
    let imageOffset = (msg.data.y * _imageWidth + msg.data.x) * 3;
    // let imageOffset = (_imageHeight - (msg.data.y + 1)) * _imageWidth * 3;
    // let imageOffset = _imageHeight - (msg.data.y*)

    for (let j = 0; j < msg.data.height; j++) {
      for (let i = 0; i < msg.data.width; i++) {
        _array[imageOffset++] = workerArray[dataOffset++];
        _array[imageOffset++] = workerArray[dataOffset++];
        _array[imageOffset++] = workerArray[dataOffset++];
      }
      imageOffset += (_imageWidth - msg.data.width) * 3;
    }

    const controllerUpdateMessage: ControllerUpdateMessage = {
      cmd: ControllerCommands.UPDATE,
      data: {
        imageArray: _array,
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

        if (_workerTiles.length) {
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
    const tile = _workerTiles.shift();

    const computeStartMessage: ComputeStartMessage = {
      cmd: ComputeCommands.START,
      data: {
        workerId,
        camera: serialize(Camera, camera),
        world: serialize(HittableList, world),
        background: msg.data.background,
        imageWidth: _imageWidth,
        imageHeight: _imageHeight,
        samplesPerPixel: _samplesPerPixel,
        maxBounces: _maxBounces,
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

    if (_workerTiles.length === 0) {
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
        imageArray: _array,
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
      imageArray: _array,
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
