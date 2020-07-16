import ComputeWorker from 'worker-loader!./compute.worker';
import {
  ControllerCommands,
  WorkerMessage,
  ControllerStartMessage,
  ControllerEndMessage,
  ComputeStartMessage,
  ComputeEndMessage,
  ComputeCommands,
} from './workerinterfaces';
import Vec3 from '../vec3';
import Camera from './camera';
import { Serialize } from 'cerializr';
import { HittableList } from './hittablelist';
import randomScene from './randomscene';

const _controllerCtx: Worker = self as never;
let _array: Uint8ClampedArray;
let _imageWidth: number;
let _imageHeight: number;
let _samplesPerPixel: number;
let _maxBounces: number;
const _computeWorkers: Map<number, ComputeWorker> = new Map<number, ComputeWorker>();

const start = (msg: ControllerStartMessage): void => {
  _imageWidth = msg.data.imageWidth;
  _imageHeight = msg.data.imageHeight;
  _samplesPerPixel = msg.data.samplesPerPixel;
  _maxBounces = msg.data.maxBounces;

  _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);

  const aspectRatio = msg.data.imageWidth / msg.data.imageHeight;
  const lookFrom = new Vec3(13, 2, 3);
  const lookAt = new Vec3(0, 0, 0);
  const vUp = new Vec3(0, -1, 0);
  //const vUp = new Vec3(0, 1, 0);

  const focusDist = 10;
  const aperture = 0.1;
  const fovY = 20;
  const camera = new Camera(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist);
  const world = randomScene();

  let startLine = 0;
  let availableLines = msg.data.imageHeight;
  const lineLoad = Math.ceil(availableLines / msg.data.computeWorkers);

  for (let workerId = 0; workerId < msg.data.computeWorkers; workerId++) {
    const computeWorker = new ComputeWorker();
    computeWorker.onmessage = onMessageFromComputeWorker;
    const computeStartMessage: ComputeStartMessage = {
      cmd: ComputeCommands.START,
      data: {
        workerId,
        camera: Serialize(camera, Camera),
        world: Serialize(world, HittableList),
        imageWidth: msg.data.imageWidth,
        imageHeight: msg.data.imageHeight,
        scanlineCount: availableLines - lineLoad < 0 ? availableLines : lineLoad,
        startLine: startLine,
        samplesPerPixel: _samplesPerPixel,
        maxBounces: _maxBounces,
      },
    };
    computeWorker.postMessage(computeStartMessage);
    _computeWorkers.set(workerId, computeWorker);
    availableLines -= lineLoad;
    startLine += lineLoad;
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

const workerIsDone = (msg: ComputeEndMessage): void => {
  const id = msg.data.workerId;
  const workerArray = msg.data.pixelArray;
  const scanlineCount = msg.data.scanlineCount;
  const startLine = msg.data.startLine;

  let imageOffset = startLine * _imageWidth * 3;
  let dataOffset = 0;
  const endLine = startLine + scanlineCount;
  for (let j = startLine; j < endLine; j++) {
    for (let i = 0; i < _imageWidth; i++) {
      _array[imageOffset++] = workerArray[dataOffset++];
      _array[imageOffset++] = workerArray[dataOffset++];
      _array[imageOffset++] = workerArray[dataOffset++];
    }
  }

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

const onMessageFromComputeWorker = (event): void => {
  const msg = event.data as WorkerMessage;

  switch (msg.cmd as ComputeCommands) {
    case ComputeCommands.END:
      workerIsDone(msg as ComputeEndMessage);
      break;

    default:
      break;
  }
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
