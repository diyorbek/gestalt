import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { flowPlugin, esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow';
import { cssModules } from '../gestalt-core/build.js';

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
    react(),
    cssModules({
      output: `./dist/gestalt`,
    }),
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
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildFlowPlugin()],
    },
  },
  // css: {
  //   modules: {
  //     localsConvention: 'dashes',
  //     generateScopedName: '[hash:base64:2]',
  //   },
  // },
});
