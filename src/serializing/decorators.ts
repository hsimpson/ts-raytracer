import { SerializableType } from './interfaces';
import { addClassName } from './metadata';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializable(type: SerializableType): void {
  addClassName(type);
}
