/// <reference types="vite-plugin-svgr/client" />
/* eslint-disable no-restricted-exports */
/* eslint-disable no-console */
import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption } from 'vite';
import monacoEditorPlugin, { IMonacoEditorOpts } from 'vite-plugin-monaco-editor';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

const monacoEditorPluginDefault = (monacoEditorPlugin as unknown as { default: unknown })
  .default as (options: IMonacoEditorOpts) => PluginOption;

const BASE_PATH = process.env.VITE_BASE_PATH ?? '/';
const isPagesBuild = process.env.VITE_PAGES_BUILD === 'true';
const awxApiPrefix = `/${['api', 'controller', 'v2'].join('/')}`;
const edaApiPrefix = `/${['api', 'eda', 'v1'].join('/')}`;
const hubApiPrefix = `/${['api', 'galaxy'].join('/')}`;
const environment = {
  AWX_API_PREFIX: awxApiPrefix,
  AWX_WEBSOCKET_PREFIX: `${awxApiPrefix}/websocket/`,
  EDA_API_PREFIX: edaApiPrefix,
  HUB_API_PREFIX: hubApiPrefix,
  METRICS_API_PREFIX: `/${['api', 'metrics', 'v1'].join('/')}`,
  PRODUCT: 'Ansible Automation Platform',
};

const pagesMonacoWorkerPlugin: PluginOption = {
  name: 'pages-monaco-worker-paths',
  transformIndexHtml: () => [
    {
      tag: 'script',
      injectTo: 'head-prepend',
      children: `self["MonacoEnvironment"] = { getWorkerUrl: function (_moduleId, label) {
        return ${JSON.stringify({
          json: `${BASE_PATH}json.worker.bundle.js`,
          editorWorkerService: `${BASE_PATH}editor.worker.bundle.js`,
          yaml: `${BASE_PATH}monaco-yaml.bundle.js`,
        })}[label]};
      }};`,
    },
  ],
};

console.log(`[demo build] BASE_PATH = ${BASE_PATH}`);

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    svgr(),
    ...(isPagesBuild
      ? [
          pagesMonacoWorkerPlugin,
          viteStaticCopy({
            targets: [
              { src: '../locales', dest: '' },
              { src: '../public/editor.worker.bundle.js', dest: '' },
              { src: '../public/json.worker.bundle.js', dest: '' },
              { src: '../public/monaco-yaml.bundle.js', dest: '' },
            ],
          }) as PluginOption,
        ]
      : [
          monacoEditorPluginDefault({
            publicPath: BASE_PATH,
            languageWorkers: ['json', 'editorWorkerService'],
            customWorkers: [{ label: 'yaml', entry: 'monaco-yaml' }],
          }),
          viteStaticCopy({ targets: [{ src: '../locales', dest: '' }] }) as PluginOption,
        ]),
  ],
  define: {
    'process.env': environment,
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
    'import.meta.env.BASE_URL': JSON.stringify(BASE_PATH),
  },
  server: {
    port: 4100,
    cors: false,
    open: true,
  },
  build: {
    outDir: 'dist-demo',
    sourcemap: false,
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        manualChunks: {
          patternfly: [
            '@patternfly/react-core',
            '@patternfly/react-icons',
            '@patternfly/react-table',
          ],
        },
      },
    },
  },
  esbuild: { legalComments: 'none' },
});
