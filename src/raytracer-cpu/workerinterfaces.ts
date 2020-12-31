import { JsonObject } from '../serializing';
import type { Vec3 } from '../vec3';
import { Triangle } from '../triangle';

export enum ControllerCommands {
  START,
  STOP,
  END,
}

export enum ComputeCommands {
  START,
  END,
}

export interface WorkerMessageData {
  [key: string]: unknown;
}

export interface WorkerMessage {
  cmd: ControllerCommands | ComputeCommands;
  data?: WorkerMessageData;
}

export interface ControllerStartMessage extends WorkerMessage {
  data: {
    imageWidth: number;
    imageHeight: number;
    samplesPerPixel: number;
    maxBounces: number;
    computeWorkers: number;
    sceneIdx: number;
    world: JsonObject;
    camera: JsonObject;
    background: Vec3;
    triangleList: Triangle[];
  };
}

export interface ControllerEndMessage extends WorkerMessage {
  data: {
    imageArray: Uint8ClampedArray;
  };
}

export interface ComputeStartMessage extends WorkerMessage {
  data: {
    workerId: number;
    camera: JsonObject;
    world: JsonObject;
    background: Vec3;
    imageWidth: number;
    imageHeight: number;
    scanlineCount: number;
    startLine: number;
    samplesPerPixel: number;
    maxBounces: number;
    triangleList: Triangle[];
  };
}

export interface ComputeEndMessage extends WorkerMessage {
  data: {
    workerId: number;
    pixelArray: Uint8ClampedArray;
    scanlineCount: number;
    startLine: number;
  };
}

// empty messages
export type ControllerStopMessage = WorkerMessage;
