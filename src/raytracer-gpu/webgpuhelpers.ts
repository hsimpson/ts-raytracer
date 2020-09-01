export function createBuffer(
  device: GPUDevice,
  arr: Float32Array | Uint16Array,
  usage: GPUBufferUsageFlags
): GPUBuffer {
  const buffer = device.createBuffer({
    mappedAtCreation: true,
    size: arr.byteLength,
    usage,
  });

  const bufferMapped = buffer.getMappedRange();

  const writeArray = arr instanceof Float32Array ? new Float32Array(bufferMapped) : new Uint16Array(bufferMapped);
  writeArray.set(arr);
  buffer.unmap();

  return buffer;
}
