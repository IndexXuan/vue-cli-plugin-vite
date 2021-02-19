import path from 'path'
import { defineConfig, Plugin } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import mpa from 'vite-plugin-mpa'

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

const plugins = [
  envCompatible(),
  vueCli(vueConfig),
  createVuePlugin(),
  useMPA ? mpa() : undefined,
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
