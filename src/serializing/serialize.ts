import { CLASSNAME_KEY, Indexable, JsonObject, JsonType, SerializableType } from './interfaces';

function _serialize<T>(type: SerializableType<T>, instance: T): JsonObject | null {
  const target: Indexable<JsonType> = {};

  const props = Object.getOwnPropertyNames(instance);

  for (const k of props) {
    const v = instance[k];
    if (Array.isArray(v)) {
      target[k] = v.map((val) => {
        if (typeof val === 'object') {
          return _serialize(val.constructor, val);
        }
        return val;
      });
    } else if (
      v instanceof Int8Array ||
      v instanceof Uint8Array ||
      v instanceof Uint8ClampedArray ||
      v instanceof Int16Array ||
      v instanceof Uint16Array ||
      v instanceof Int32Array ||
      v instanceof Uint32Array ||
      v instanceof Float32Array ||
      v instanceof Float64Array
    ) {
      target[k] = Array.from(v);
    } else if (typeof v === 'object') {
      target[k] = _serialize(v.constructor, v);
    } else {
      target[k] = v;
    }
  }

  target[CLASSNAME_KEY] = instance.constructor.name;

  return target;
}

export function serialize<T>(type: SerializableType<T>, instance: T): JsonObject | null {
  return _serialize(type, instance);
}
