export function isAbsoluteUrl(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

export function isDataUrl(url: string): boolean {
  return /^data:/.test(url);
}

export function urlDirname(url: string): string {
  const dirname = url.substring(0, url.lastIndexOf('/') + 1);
  return dirname;
}
