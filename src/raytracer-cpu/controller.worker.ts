import { DeserializerMap } from './deserializermap';
import {
  ComputeEndMessage,
  ControllerCommands,
  ControllerEndMessage,
  ControllerReadyMessage,
  ControllerStartMessage,
  ControllerUpdateMessage,
  WorkerMessage,
} from './workerinterfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const map = DeserializerMap;

const _controllerCtx: Worker = self as never;

let _pixelArray: Uint8ClampedArray;
let _imageWidth: number;
let _imageHeight: number;

const start = (msg: ControllerStartMessage): void => {
  _imageWidth = msg.data.imageWidth;
  _imageHeight = msg.data.imageHeight;

  _pixelArray = new Uint8ClampedArray(_imageWidth * _imageHeight * 4);
  const controllerReadyMessage: ControllerReadyMessage = {
    cmd: ControllerCommands.READY,
  };

  _controllerCtx.postMessage(controllerReadyMessage);
};

const workerIsDone = (msg: ComputeEndMessage): void => {
  const workerArray = msg.data.pixelArray;

  let dataOffset = 0;
  let imageOffset = (msg.data.y * _imageWidth + msg.data.x) * 4;
  // let imageOffset = (_imageHeight - (msg.data.y + 1)) * _imageWidth * 3;
  // let imageOffset = _imageHeight - (msg.data.y*)

  for (let j = 0; j < msg.data.height; j++) {
    for (let i = 0; i < msg.data.width; i++) {
      _pixelArray[imageOffset++] = workerArray[dataOffset++];
      _pixelArray[imageOffset++] = workerArray[dataOffset++];
      _pixelArray[imageOffset++] = workerArray[dataOffset++];
      _pixelArray[imageOffset++] = workerArray[dataOffset++];
    }
    imageOffset += (_imageWidth - msg.data.width) * 4;
  }

  const controllerUpdateMessage: ControllerUpdateMessage = {
    cmd: ControllerCommands.UPDATE,
    data: {
      imageArray: _pixelArray,
    },
  };
  _controllerCtx.postMessage(controllerUpdateMessage);
};

const stop = (): void => {
  console.log('controller stop');

  const controllerEndMessage: ControllerEndMessage = {
    cmd: ControllerCommands.END,
    data: {
      imageArray: _pixelArray,
    },
  };
  _controllerCtx.postMessage(controllerEndMessage);
};

// Respond to message from parent thread
_controllerCtx.addEventListener('message', event => {
  const msg = event.data as WorkerMessage;

  switch (msg.cmd as ControllerCommands) {
    case ControllerCommands.START:
      start(msg as ControllerStartMessage);
      break;
    case ControllerCommands.STOP:
      stop();
      break;
    case ControllerCommands.WORKERDONE:
      workerIsDone(msg as ComputeEndMessage);
      break;
    default:
      break;
  }
});
