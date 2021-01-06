import ComputeWorker from 'worker-loader!./compute.worker';
import { Camera } from '../camera';
import { deserialize, serialize } from '../serializing';
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

const start = (msg: ControllerStartMessage): void => {
  _imageWidth = msg.data.imageWidth;
  _imageHeight = msg.data.imageHeight;
  _samplesPerPixel = msg.data.samplesPerPixel;
  _maxBounces = msg.data.maxBounces;

  _array = new Uint8ClampedArray(_imageWidth * _imageHeight * 3);

  const world = deserialize(HittableList, msg.data.world);
  const camera = deserialize(Camera, msg.data.camera);
  // const triangleMesh = deserialize(TriangleMesh, msg.data.triangleMesh);

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
        background: msg.data.background,
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
