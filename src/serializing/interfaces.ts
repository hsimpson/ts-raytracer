/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type JsonType = null | string | number | boolean | JsonObject | JsonArray;

export interface SerializableType {
  new (...args: any[]): any;
}

export interface JsonObject extends Indexable {}
export interface JsonArray extends Array<JsonType> {}

export interface Indexable {
  [idx: string]: JsonType;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type IConstructable = { constructor: Function };

export const CLASSNAME_KEY = '__CLASSNAME__';
