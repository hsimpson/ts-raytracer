import ComputeWorker from 'worker-loader!./compute.worker';
import Camera from '../camera';
import { deserialize, serialize } from '../serializing';
import Vec3 from '../vec3';
import { DeserializerMap } from './deserializermap';
import { HittableList } from './hittablelist';
import {
  ComputeCommands,
  ComputeEndMessage,
  ComputeStartMessage,
  ControllerCommands,
  ControllerEndMessage,
  ControllerStartMessage,
  WorkerMessage,
} from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;

const _controllerCtx: Worker = self as never;
let _array: Uint8ClampedArray;
let _imageWidth: number;
let _imageHeight: number;
let _samplesPerPixel: number;
let _maxBounces: number;
const _computeWorkers: Map<number, ComputeWorker> = new Map<number, ComputeWorker>();

const start = async (msg: ControllerStartMessage): Promise<void> => {
  _imageWidth = msg.data.imageWidth;
  _imageHeight = msg.data.imageHeight;
  _samplesPerPixel = msg.data.samplesPerPixel;
  _maxBounces = msg.data.maxBounces;

  _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);

  const aspectRatio = msg.data.imageWidth / msg.data.imageHeight;
  let lookFrom: Vec3;
  let lookAt: Vec3;

  const focusDist = 10;
  let aperture = 0.0;
  //const aperture = 0.0;
  //const fovY = 20;
  let fovY = 40;
  let background = new Vec3(0, 0, 0);
  const cameraT0 = 0.0;
  let cameraT1 = 0.0;

  const world = deserialize(HittableList, msg.data.world);

  switch (msg.data.sceneIdx) {
    case 1:
      background = new Vec3(0.7, 0.8, 1.0);
      lookFrom = new Vec3(13, 2, 3);
      lookAt = new Vec3(0, 0, 0);
      fovY = 20.0;
      aperture = 0.1;
      cameraT1 = 1.0;
      break;

    case 2:
      background = new Vec3(0.7, 0.8, 1.0);
      lookFrom = new Vec3(13, 2, 3);
      lookAt = new Vec3(0, 0, 0);
      fovY = 20.0;
      break;

    case 3:
      background = new Vec3(0.7, 0.8, 1.0);
      lookFrom = new Vec3(13, 2, 3);
      lookAt = new Vec3(0, 0, 0);
      fovY = 20.0;
      break;

    case 4:
      background = new Vec3(0.7, 0.8, 1.0);
      lookFrom = new Vec3(13, 2, 3);
      lookAt = new Vec3(0, 0, 0);
      fovY = 20.0;
      break;

    case 5:
      background = new Vec3(0, 0, 0);
      lookFrom = new Vec3(26, 3, 6);
      lookAt = new Vec3(0, 2, 0);
      fovY = 20.0;
      break;

    case 6:
      background = new Vec3(0, 0, 0);
      lookFrom = new Vec3(278, 278, -800);
      lookAt = new Vec3(278, 278, 0);
      fovY = 40.0;
      break;

    case 7:
      background = new Vec3(0, 0, 0);
      lookFrom = new Vec3(278, 278, -800);
      lookAt = new Vec3(278, 278, 0);
      fovY = 40.0;
      break;

    case 8:
      background = new Vec3(0, 0, 0);
      lookFrom = new Vec3(478, 278, -600);
      lookAt = new Vec3(278, 278, 0);
      fovY = 40.0;
      cameraT1 = 1.0;
      break;

    default:
      background = new Vec3(0, 0, 0);
      break;
  }

  const camera = new Camera();
  const vUp = new Vec3(0, 1, 0);
  camera.init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, cameraT0, cameraT1);

  let startLine = msg.data.imageHeight - 1;
  let availableLines = msg.data.imageHeight;
  const lineLoad = Math.ceil(availableLines / msg.data.computeWorkers);

  for (let workerId = 0; workerId < msg.data.computeWorkers; workerId++) {
    const computeWorker = new ComputeWorker();
    computeWorker.onmessage = onMessageFromComputeWorker;
    const computeStartMessage: ComputeStartMessage = {
      cmd: ComputeCommands.START,
      data: {
        workerId,
        camera: serialize(Camera, camera),
        world: serialize(HittableList, world),
        background: serialize(Vec3, background),
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
    startLine -= lineLoad;
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
  //

  //let imageOffset = (startLine + 1 - scanlineCount) * _imageWidth * 3;
  let imageOffset = (_imageHeight - (startLine + 1)) * _imageWidth * 3;
  let dataOffset = 0;
  //const endLine = startLine + scanlineCount;
  // if (id === 0) {
  for (let j = 0; j < scanlineCount; j++) {
    for (let i = 0; i < _imageWidth; i++) {
      _array[imageOffset++] = workerArray[dataOffset++];
      _array[imageOffset++] = workerArray[dataOffset++];
      _array[imageOffset++] = workerArray[dataOffset++];
    }
  }
  // }

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
