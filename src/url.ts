export function isAbsoluteUrl(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

export function isDataUrl(url: string): boolean {
  return /^data:/.test(url);
}
