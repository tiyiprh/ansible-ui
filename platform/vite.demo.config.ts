/// <reference types="vite-plugin-svgr/client" />
/* eslint-disable no-restricted-exports */
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption, type UserConfig } from 'vite';
import monacoEditorPlugin, { IMonacoEditorOpts } from 'vite-plugin-monaco-editor';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import type { InlineConfig } from 'vitest/node';

const monacoEditorPluginDefault = (monacoEditorPlugin as unknown as { default: unknown })
  .default as (options: IMonacoEditorOpts) => PluginOption;

// GitLab Pages serves from /<repo-name>/ — set VITE_BASE_PATH env var at build time.
// For local preview, defaults to '/'.
const BASE_PATH = process.env.VITE_BASE_PATH ?? '/';

interface VitestUserConfig extends UserConfig {
  test: InlineConfig;
}

const config: VitestUserConfig = {
  base: BASE_PATH,
  plugins: [
    react(),
    svgr(),
    monacoEditorPluginDefault({
      publicPath: BASE_PATH,
      languageWorkers: ['json', 'editorWorkerService'],
      customWorkers: [{ label: 'yaml', entry: 'monaco-yaml' }],
    }),
    viteStaticCopy({ targets: [{ src: '../locales', dest: '' }] }) as PluginOption,
  ],
  define: {
    'process.env': {
      PLATFORM_SERVER: '',
      AWX_API_PREFIX: '/api/controller/v2',
      AWX_WEBSOCKET_PREFIX: '/api/controller/v2/websocket/',
      EDA_API_PREFIX: '/api/eda/v1',
      HUB_API_PREFIX: '/api/galaxy',
      METRICS_API_PREFIX: '/api/metrics/v1',
      DEV_SERVER_PROTOCOL: 'http',
    },
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
    'import.meta.env.BASE_URL': JSON.stringify(BASE_PATH),
  },
  server: {
    https: false,
    port: 4300,
  },
  esbuild: { legalComments: 'none' },
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
            '@patternfly/react-styles',
            '@patternfly/react-table',
            '@patternfly/react-tokens',
          ],
          pfcharts: ['@patternfly/react-charts/victory'],
          'monaco-editor': ['monaco-editor'],
          'monaco-yaml': ['monaco-yaml'],
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest.setup.ts'],
  },
};

export default defineConfig(config);
