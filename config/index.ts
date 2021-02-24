import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import mpa from 'vite-plugin-mpa'
import { Options } from './options'

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
//    port: Number
//    host: String
//    proxy: Object,
//    before: Function
//  },
//  pluginOptions: {
//    vite: {
//      alias: Record<string, string>,
//      plugins: Plugin[],
//      vitePluginVue2Options: { jsx: true }
//  },
//},

const pluginOptions = vueConfig.pluginOptions || {}
const viteOptions: Options = pluginOptions.vite || {}
const alias = viteOptions.alias || {}
const extraPlugins = viteOptions.plugins || []

const useMPA = Boolean(vueConfig.pages)

const plugins = [
  envCompatible(),
  vueCli(vueConfig),
  createVuePlugin(viteOptions.vitePluginVue2Options),
  useMPA
    ? mpa({
        // special use main.html for vue-cli
        filename: 'main.html',
      })
    : undefined,
  ...extraPlugins,
].filter(Boolean)

// @see https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      // high-priority for user-provided alias
      ...alias,
    },
  },
  plugins,
})
