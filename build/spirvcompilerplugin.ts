import * as child_process from 'child_process';
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

const PLUGIN_NAME = 'spirvcompiler-webpack-plugin';

interface SpirVCompilerPluginOptions {
  compilerOptions: string;
  inputFiles: string[];
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
          // console.log(`+++ inputfile: ${inputFile}`);
          // console.log(`+++ outputFile: ${outputFile}`);

          const fileName = path.basename(inputFile);
          const outputFile = path.join(outputDir, `${fileName}.spv`);

          const cmd = 'glslc'; // glslc.exe on windows
          //console.log(`cmd: ${cmd}`);

          // TODO: error handling from stderr
          // spawn.execSync(cmd);
          const args = [inputFile, this.options.compilerOptions, outputFile];
          promises.push(this.callCompiler(compilation, cmd, args));
        }

        Promise.all(promises).then(() => {
          callback();
        });
      });
    });
  }
}
