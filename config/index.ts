import path from 'path'
import { defineConfig, Plugin } from 'vite'
import zone, { ZoneOptions } from '@nibfe/vite-plugin-zone'
import envCompatible from '@nibfe/vite-plugin-env-compatible'
import { createVuePlugin } from 'vite-plugin-vue2'
import autoRouting, { AutoRoutingOptions } from '@nibfe/vite-plugin-auto-routing'
import mock from '@nibfe/vite-plugin-mock'
import mpa from '@nibfe/vite-plugin-mpa'
import legacy from 'vite-plugin-legacy'

const hasRome = process.env.ROME === 'on'

let vueConfig: {
  publicPath?: string
  outputDir?: string
  productionSourceMap?: boolean
  css?: {
    sourceMap?: boolean
    loaderOptions?: Record<string, any>
    extract?: any
  }
  configureWebpack?: any
  chainWebpack?: any
  devServer?: {
    open?: boolean
    public?: any
    port?: number
    proxy?: any
    https?: any
  }
  pluginOptions?: Record<string, any>
} = {}
try {
  vueConfig = require(path.resolve(process.cwd(), 'vue.config.js')) || {}
} catch (e) {
  /**/
}

// @see https://cli.vuejs.org/config/#baseurl
//{
//  publicPath: '/',
//  outputDir: 'build',
//  productionSourceMap: false,
//  css: {
//    sourceMap: false,
//  },
//  configureWebpack: Object | Function
//  chainWebpack: Function
//  devServer: {
//    proxy: Object,
//  },
//  pluginOptions: {
//     stone: { safeRedirect: true }, // remove
//     login: false, // remove
//     typescript: true, // done
//     autoGlobal: true, // done
//     autoRouting: true, // done
//     autoSplitChunks: true, // pending
//     mock: true, // done
//     mpa: true, // done
//     pwa: false, // todo
//     qiankun: false, // todo
//     ssr: false, // todo
//     lazyCompile: false, // remove
//     sourceMap: { codeSourceMap: false, cssSourceMap: false }, // done，vite-plugin-zone 内部根据环境变量处理
//     eslint: { lintOnSave: true }, // remove
//     stylelint: { lintOnSave: true }, // remove
//     srcRestriction: true, // done
//     vite: {
//       alias: Record<string, string>, // done
//       plugins: Plugin[], // done
//     } // TODO: 是否要支持所有 vite.config.ts 配置 ？倾向于不支持，没法决定 merge 策略
//   },
//},

const devServer = vueConfig.devServer || {}
const css = vueConfig.css || {}
const pluginOptions = vueConfig.pluginOptions || {}
const alias = (pluginOptions.vite && pluginOptions.vite.alias) || ({} as Record<string, string>)
const extraPlugins = (pluginOptions.vite && pluginOptions.vite.plugins) || ([] as Plugin[])

// Zone Plugins
const useMPA = hasRome || Boolean(pluginOptions.mpa)
const useAutoRouting = hasRome || Boolean(pluginOptions.autoRouting)
// always mock, side effectiveness
const useMock = true

// Zone Options
const useAutoGlobal = Boolean(pluginOptions.autoGlobal)
const useAutoSplitChunks = false // Boolean(pluginOptions.autoSplitChunks)
const useTypeScript: ZoneOptions['typescript'] = pluginOptions.typescript
  ? pluginOptions.typescript
  : false
const useSrcRestriction = Boolean(pluginOptions.srcRestriction)
const modernBuild = Boolean(process.env.MODERN) && process.env.MODERN !== 'false'

const plugins = [
  // 必开
  envCompatible(),
  // 必开
  createVuePlugin(),
  // 可选，完全无害
  useMock ? mock() : undefined,
  // 可选，有一定侵入性
  useMPA ? mpa() : undefined,
  // 可选，基本无害
  useAutoRouting ? autoRouting(pluginOptions.autoRouting as AutoRoutingOptions) : undefined,
  // 可选，危险，谨慎使用
  !modernBuild
    ? legacy({
        // https://babeljs.io/docs/en/babel-preset-env#ignorebrowserslistconfig
        ignoreBrowserslistConfig: false,
        // When true, core-js@3 modules are inlined based on usage.
        // When false, global namespace APIs (eg: Object.entries) are loaded
        // from the Polyfill.io server.
        corejs: true,
      })
    : undefined,
  zone({
    // 下方为团队配置，不开源
    modernBuild,
    typescript: useTypeScript,
    srcRestriction: useSrcRestriction,
    autoGlobal: useAutoGlobal,
    autoSplitChunks: useAutoSplitChunks,
  }),
  ...extraPlugins,
].filter(Boolean)

// @see https://vitejs.dev/config/
export default defineConfig({
  base: vueConfig.publicPath,
  resolve: {
    alias,
  },
  css: {
    preprocessorOptions: css.loaderOptions,
  },
  server: {
    host: process.env.DEV_HOST || devServer.public,
    port: Number(process.env.PORT) || devServer.port,
    strictPort: true,
    https: devServer.https,
    open: process.platform === 'darwin' || devServer.open,
    proxy: devServer.proxy,
  },
  build: {
    outDir: vueConfig.outputDir,
    cssCodeSplit: Boolean(css.extract),
    sourcemap:
      process.env.GENERATE_SOURCEMAP === 'true' || vueConfig.productionSourceMap || css.sourceMap,
  },
  plugins,
})
