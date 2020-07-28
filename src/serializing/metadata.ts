/* eslint-disable @typescript-eslint/no-explicit-any */

import { SerializableType } from './interfaces';

const _metaMap = new Map<string, SerializableType<any>>();

export function addClassName(type: SerializableType<any>): void {
  //console.log(`add constructor of ${type.name} to map`);
  _metaMap.set(type.name, type);
}

export function getClassConstructor(name: string): SerializableType<any> | null {
  if (_metaMap.has(name)) {
    return _metaMap.get(name);
  }
  console.error(`${name} not serializable, use the @serializable decorator`);
  return null;
}
