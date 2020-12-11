if('defaultQueue' in GPUDevice.prototype === false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GPUDevice.prototype.defaultQueue = (GPUDevice as any).prototype.getQueue;
}

if('createView' in GPUTexture.prototype === false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GPUTexture.prototype.createView = (GPUTexture as any).prototype.createDefaultView;
}
