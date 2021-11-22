const INCLUDE_REGEX = /^#include\s"(.*)"$/gm;

interface ShaderMap {
  [key: string]: boolean;
}

let shaderMap: ShaderMap;

async function getShaderHash(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

async function getUrlContent(url: URL): Promise<string> {
  const response = await fetch(url.toString());
  if (response.ok) {
    return response.text();
  }
  return '';
}

async function includeShaders(shaderUrl: URL): Promise<string> {
  let shaderText = await getUrlContent(shaderUrl);
  let match;
  INCLUDE_REGEX.lastIndex = 0;
  const shaderUrlStr = shaderUrl.toString();
  const baseUrl = shaderUrlStr.substring(0, shaderUrl.toString().lastIndexOf('/') + 1);

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

      const hash = await getShaderHash(includeText);
      if (!shaderMap[hash]) {
        shaderMap[hash] = true;
        shaderText = shaderText.replace(replacement, includeText);
      } else {
        shaderText = shaderText.replace(replacement, '');
      }
    }
  }

  return shaderText;
}

export async function preprocessShader(shaderUrl: URL): Promise<string> {
  shaderMap = {};
  return await includeShaders(shaderUrl);
}
