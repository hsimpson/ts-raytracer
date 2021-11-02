import child_process from 'child_process';
import path from 'path';

const inputFiles = [
  './src/raytracer-gpu/shaders/raytracer.comp',
  './src/raytracer-gpu/shaders/renderer.vert',
  './src/raytracer-gpu/shaders/renderer.frag',
];

export default function compileShaders(outdir) {
  console.log('Compiling shaders...');

  const promises = [];
  for (const inputFile of inputFiles) {
    const fileName = path.basename(inputFile);
    const outputFile = path.join(outdir, `${fileName}.spv`);

    const cmd = 'glslangValidator';
    const args = ['-V', '-o', outputFile, inputFile];

    console.log(`call: ${cmd} ${args.join(' ')}`);
    promises.push(
      new Promise((resolve, reject) => {
        const child = child_process.spawn(cmd, args);

        let stderrStr = '';

        child.on('error', (error) => {
          console.error(error);
          reject();
        });

        child.stderr.on('data', (chunk) => {
          stderrStr += chunk;
        });

        child.on('close', (exitCode) => {
          if (exitCode !== 0) {
            console.error(stderrStr);
          }
          resolve();
        });
      })
    );
  }
}

// glslangValidator -V -o src/raytracer-gpu/shaders/raytracer.comp.spv src/raytracer-gpu/shaders/raytracer.comp
