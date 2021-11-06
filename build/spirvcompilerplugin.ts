import * as child_process from 'child_process';
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

const PLUGIN_NAME = 'spirvcompiler-webpack-plugin';

export enum SpirvCompiler {
  glslc,
  glslangValidator,
}

interface SpirVCompilerPluginOptions {
  // compilerOptions: string;
  inputFiles: string[];
  compiler: SpirvCompiler;
  // watchDirs: string[];
}

export default class SpirVCompilerPlugin /*extends webpack.Plugin*/ {
  private options: SpirVCompilerPluginOptions;

  public constructor(options: SpirVCompilerPluginOptions) {
    // super();
    this.options = options;
  }

  private async callCompiler(compilation: webpack.Compilation, cmd: string, args: string[]): Promise<void> {
    const logger = compilation.getLogger(PLUGIN_NAME);
    return new Promise((resolve) => {
      const child = child_process.spawn(cmd, args);
      // logger.info(`${cmd} ${args.join(' ')}`);

      let stderrStr = '';

      child.on('error', (error: Error) => {
        logger.error(error);
        resolve();
      });

      child.stderr.on('data', (chunk) => {
        stderrStr += chunk;
      });

      child.on('close', (exitCode) => {
        if (exitCode !== 0) {
          logger.error(stderrStr);
        }
        resolve();
      });
    });
  }

  public apply(compiler: webpack.Compiler): void {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      // const logger = compilation.getLogger('spirvcompiler-webpack-plugin');

      compilation.hooks.additionalAssets.tapAsync('spirvcompiler-webpack-plugin', async (callback) => {
        const promises = [];

        const outputDir = compiler.options.output.path;
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }

        for (const inputFile of this.options.inputFiles) {
          const fileName = path.basename(inputFile);
          const outputFile = path.join(outputDir, `${fileName}.spv`);
          // console.log(`+++ inputfile: ${inputFile}`);
          // console.log(`+++ outputFile: ${outputFile}`);

          let cmd = '';
          let args = [];
          switch (this.options.compiler) {
            case SpirvCompiler.glslc:
              cmd = 'glslc'; // glslc.exe on windows
              args.push(...[inputFile, '-o', outputFile]);
              break;
            case SpirvCompiler.glslangValidator:
              cmd = 'glslangValidator'; // glslangValidator.exe on windows
              args.push(...['-V', '-o', outputFile, inputFile]);
              break;
          }

          promises.push(this.callCompiler(compilation, cmd, args));
        }

        Promise.all(promises).then(() => {
          callback();
        });
      });
    });
  }
}
