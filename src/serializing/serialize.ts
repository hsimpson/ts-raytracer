/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLASSNAME_KEY, Indexable, JsonObject, JsonArray, JsonType, SerializableType } from './interfaces';

function _serializeObject(type: SerializableType, instance: any): JsonObject {
  const target: JsonObject = {};
  const name = instance.constructor.name;
  const props = Object.getOwnPropertyNames(instance);

  target[CLASSNAME_KEY] = name;
  for (const prop of props) {
    const val = instance[prop];
    target[prop] = _serialize(val.constructor, val);
  }

  return target;
}

function _serializeArray(type: SerializableType, instance: any): JsonArray {
  const target = instance.map((val) => {
    return _serialize(val.constructor, val);
  });
  return target;
}

function _serialize(type: SerializableType, instance: any): JsonType {
  if (Array.isArray(instance)) {
    return _serializeArray(type, instance);
  } else if (
    instance instanceof Int8Array ||
    instance instanceof Uint8Array ||
    instance instanceof Uint8ClampedArray ||
    instance instanceof Int16Array ||
    instance instanceof Uint16Array ||
    instance instanceof Int32Array ||
    instance instanceof Uint32Array ||
    instance instanceof Float32Array ||
    instance instanceof Float64Array
  ) {
    return Array.from(instance);
  } else if (typeof instance === 'object') {
    return _serializeObject(type, instance);
  } else if (typeof instance === 'string' || typeof instance === 'number' || typeof instance === 'boolean') {
    return instance as any;
  } else {
    console.error(`Instance not serializable, constructor: ${instance.constructor.name}`);
  }
}

export function serialize(type: SerializableType, instance: any): JsonObject {
  return _serializeObject(type, instance);
}
