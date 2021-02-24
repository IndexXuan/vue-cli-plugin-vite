import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import mpa from 'vite-plugin-mpa'
import { Options } from './options'
import Config from 'webpack-chain'
import merge from 'webpack-merge'
import { name } from '../package.json'

// vue.config.js
let vueConfig: VueCliOptions = {}
try {
  vueConfig = require(path.resolve(process.cwd(), 'vue.config.js')) || {}
} catch (e) {
  /**/
}

const pluginOptions = vueConfig.pluginOptions || {}
const viteOptions: Options = pluginOptions.vite || {}
const extraPlugins = viteOptions.plugins || []

if (viteOptions.alias) {
  console.log(
    `[${name}]: pluginOptions.vite.alias is deprecated, will auto resolved from chainWebpack / configureWebpack`,
  )
}

const chainableConfig = new Config()
vueConfig.chainWebpack(chainableConfig)
// @see temp/webpack*.js & temp/vue.config.js
const aliasOfChainWebpack = chainableConfig.resolve.alias.entries()
const aliasOfConfigureWebpackObjectMode =
  (vueConfig.configureWebpack &&
    vueConfig.configureWebpack.resolve &&
    vueConfig.configureWebpack.resolve.alias) ||
  {}
const aliasOfConfigureWebpackFunctionMode = (() => {
  if (typeof vueConfig.configureWebpack === 'function') {
    let originConfig = chainableConfig.toConfig()
    const res = vueConfig.configureWebpack(originConfig)
    originConfig = merge(originConfig, res)
    if (res) {
      return res.resolve.alias || {}
    }
    return originConfig.resolve.alias || {}
  }
})()
const alias = {
  ...aliasOfConfigureWebpackObjectMode,
  ...aliasOfConfigureWebpackFunctionMode,
  ...aliasOfChainWebpack,
}

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
