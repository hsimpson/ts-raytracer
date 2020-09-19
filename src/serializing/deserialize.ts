/* eslint-disable @typescript-eslint/no-explicit-any */
import { SerializableType, JsonObject, CLASSNAME_KEY } from './interfaces';
import { getClassConstructor } from './metadata';

function _deserialize(type: SerializableType, data: JsonObject): any {
  const instance = Object.create(type.prototype);
  for (const k in data) {
    const v = data[k];
    if (Array.isArray(v)) {
      instance[k] = v.map((val) => {
        const className = val[CLASSNAME_KEY];
        if (className) {
          const newtype = getClassConstructor(val[CLASSNAME_KEY]);
          return _deserialize(newtype, val as JsonObject);
        }
        return val;
      });
    } else if (typeof v === 'object') {
      const newtype = getClassConstructor(v[CLASSNAME_KEY] as string);
      instance[k] = _deserialize(newtype, v as JsonObject);
    } else {
      instance[k] = v;
    }
  }
  return instance;
}

export function deserialize(type: SerializableType, data: JsonObject): any {
  return _deserialize(type, data);
}
