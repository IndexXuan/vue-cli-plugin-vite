import path from 'path'
import { defineConfig, Plugin } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import { createVuePlugin } from 'vite-plugin-vue2'
import mpa from 'vite-plugin-mpa'
import legacy from 'vite-plugin-legacy'

// vue.config.js
let vueConfig: VueCliOptions = {}
try {
  vueConfig = require(path.resolve(process.cwd(), 'vue.config.js')) || {}
} catch (e) {
  /**/
}

// vueConfig
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
//    vite: {
//      alias: Record<string, string>,
//      plugins: Plugin[],
//  },
//},

const pluginOptions = vueConfig.pluginOptions || {}
const alias = (pluginOptions.vite && pluginOptions.vite.alias) || ({} as Record<string, string>)
const extraPlugins = (pluginOptions.vite && pluginOptions.vite.plugins) || ([] as Plugin[])

const useMPA = Boolean(vueConfig.pages)

const modernBuild = process.env.MODERN !== 'false'

const plugins = [
  envCompatible(),
  vueCli(vueConfig),
  createVuePlugin(),
  useMPA ? mpa() : undefined,
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
  ...extraPlugins,
].filter(Boolean)

// @see https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      ...alias,
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  plugins,
})
