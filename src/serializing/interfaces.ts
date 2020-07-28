/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type JsonType = null | string | number | boolean | JsonObject | JsonArray;

export interface SerializableType<T> {
  new (...args: any[]): T;
}

export interface JsonObject extends Indexable<JsonType | JsonObject> {}
export interface JsonArray extends Array<JsonType> {}

export interface Indexable<T = any | null> {
  [idx: string]: T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type IConstructable = { constructor: Function };

export const CLASSNAME_KEY = '__CLASSNAME__';
