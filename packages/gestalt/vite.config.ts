import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { parseString } from 'xml2js';
import fs from 'fs';
import { flowPlugin, esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow';
import { cssModules } from '../gestalt-core/build';
import loadCssModuleFile from './vite-plugin-css-modules';
import postcssPresetEnv from 'postcss-preset-env';

const breakpoints = {
  '--g-sm': '(min-width: 576px)',
  '--g-md': '(min-width: 768px)',
  '--g-lg': '(min-width: 1312px)',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    flowPlugin(),
    {
      enforce: 'pre',
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    loadCssModuleFile({ include: (id) => id.includes('.css') }),
    // react(),
    {
      enforce: 'pre',
      name: 'svgPath',
      load(id) {
        if (!id.includes('.svg')) {
          return null;
        }

        const data = fs.readFileSync(id, 'utf-8');

        return new Promise((resolve, reject) => {
          parseString(data, (err, result) => {
            if (err) {
              reject(err);
            } else {
              const path = result.svg.path[0].$.d;
              const code = `export default '${path}';`;
              resolve({ code });
            }
          });
        });
      },
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'gest',
      fileName: (format) =>
        format === 'umd' ? `gestalt.js` : `gestalt.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'classnames/bind', 'classnames', 'react-dom'],
      output: {
        assetFileNames: 'gestalt.[ext]',
      },
    },
    minify: false,
    cssMinify: true,
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildFlowPlugin()],
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            'custom-properties': false,
            'custom-media-queries': {
              importFrom: [{ customMedia: breakpoints }], // this is not being applied to `composed` css files, only to imported ones to js
            },
          },
        }),
      ],
    },
    modules: {
      localsConvention: 'dashes',
      generateScopedName: '[hash:base64:4]', // needs to be replaced with existing classname generator
    },
  },
});
