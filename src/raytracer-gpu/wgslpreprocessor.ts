import { urlDirname } from '../url';

const INCLUDE_REGEX = /^#include\s"(.*)"$/gm;

interface ShaderMap {
  [key: string]: boolean;
}

let shaderMap: ShaderMap;

async function getShaderHash(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

async function getUrlContent(url: URL): Promise<string> {
  const shaderUrl = url.toString();
  const response = await fetch(shaderUrl);
  let content = '';
  if (response.ok) {
    const shaderCode = await response.text();
    const hash = await getShaderHash(shaderCode);
    if (!shaderMap[hash]) {
      console.log(`Using shader module ${shaderUrl}`);
      shaderMap[hash] = true;
      content = shaderCode;
    }
  } else {
    console.error(`Failed to load shader module ${shaderUrl}`);
  }
  return content;
}

async function includeShaders(shaderUrl: URL): Promise<string> {
  let shaderText = await getUrlContent(shaderUrl);
  let match;
  INCLUDE_REGEX.lastIndex = 0;
  const shaderUrlStr = shaderUrl.toString();
  const baseUrl = urlDirname(shaderUrlStr);

  while ((match = INCLUDE_REGEX.exec(shaderText)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === INCLUDE_REGEX.lastIndex) {
      INCLUDE_REGEX.lastIndex++;
    }

    if (match.length === 2) {
      const replacement = match[0];
      const filename = match[1];

      const includeUrl = new URL(filename, baseUrl);
      const includeText = await includeShaders(includeUrl);

      shaderText = shaderText.replace(replacement, includeText);
    }
  }

  return shaderText;
}

export async function preprocessShader(shaderUrl: URL): Promise<string> {
  shaderMap = {};
  return await includeShaders(shaderUrl);
}
