import { JsonObject } from '../serializing';
import { vec3 } from 'gl-matrix';

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
    background: vec3;
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
    background: vec3;
    imageWidth: number;
    imageHeight: number;
    scanlineCount: number;
    startLine: number;
    samplesPerPixel: number;
    maxBounces: number;
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
