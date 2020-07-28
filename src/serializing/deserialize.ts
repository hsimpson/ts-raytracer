import { SerializableType, JsonObject, CLASSNAME_KEY } from './interfaces';
import { getClassConstructor } from './metadata';

function _deserialize<T>(type: SerializableType<T>, data: JsonObject): T {
  const instance = Object.create(type.prototype);
  for (const k in data) {
    const v = data[k];
    if (Array.isArray(v)) {
      instance[k] = v.map((val) => {
        const newtype = getClassConstructor(val[CLASSNAME_KEY]);
        return _deserialize(newtype, val as JsonObject);
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

export function deserialize<T>(type: SerializableType<T>, data: JsonObject): T {
  return _deserialize(type, data);
}
