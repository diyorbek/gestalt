import path, { extname } from 'path';
import fs from 'fs';
import type { Plugin, ResolvedConfig } from 'vite';

const queryRE = /\?.*$/;
const hashRE = /#.*$/;

const cleanUrl = (url: string): string =>
  url.replace(hashRE, '').replace(queryRE, '');

let resolvedConfig: ResolvedConfig;
const cssModuleMap = new Map<string, string>();
const originFileMap = new Map<string, string>();

function getFullPath(id: string): string {
  return path.join(resolvedConfig.root, id);
}

function getFilePath(id: string): string | undefined {
  const fullPath = path.join(resolvedConfig.root, id);

  if (cssModuleMap.has(id)) return cssModuleMap.get(id);

  if (id.startsWith('/') && cssModuleMap.has(fullPath))
    return cssModuleMap.get(fullPath);
}

export interface LoadCssModuleFileOptions {
  include: (id: string) => boolean;
}

export default function loadCssModuleFile(
  options: LoadCssModuleFileOptions
): Plugin {
  const { include } = options;

  return {
    name: 'load-css-module',
    enforce: 'pre',

    configResolved(config) {
      resolvedConfig = config;
    },

    async resolveId(id, importer) {
      // fix: postcss url(xxx)
      if (!include(id) || !id.startsWith('.')) return null;
      // console.log('resolver', { id });

      if (originFileMap.has(id)) return originFileMap.get(id);

      // --- maybe remmove cuz we dont import css like '/a.css'
      // /a.module.css => /absPath/a.module.css
      // if (id.startsWith("/")) {
      //   const fullPath = getFullPath(id);

      //   if (cssModuleMap.has(fullPath)) return fullPath;
      // }

      const resolvedPath = path.resolve(importer, '../', id);
      const parsed = path.parse(resolvedPath);
      const proxyPath = path.format({
        ...parsed,
        base: `${parsed.name}.module${parsed.ext}`,
      });

      cssModuleMap.set(proxyPath, resolvedPath);
      originFileMap.set(resolvedPath, proxyPath);

      return proxyPath;
    },

    load(id) {
      const filePath = getFilePath(id);

      if (!filePath) return null;
      // console.log('loader', { id });

      const cleanedPath = cleanUrl(filePath);
      this.addWatchFile(cleanedPath);

      return fs.readFileSync(cleanedPath, 'utf-8');
    },
  };
}
