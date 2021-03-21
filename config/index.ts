import path from 'path'
import { defineConfig } from 'vite'
import Config from 'webpack-chain'
import merge from 'webpack-merge'
import { createVuePlugin } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
// import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import vueCli, { VueCliOptions } from '../../vite-plugin-vue-cli/src/index'

import mpa from 'vite-plugin-mpa'
import { Options } from './options'
import { name } from '../package.json'

const resolve = (p: string) => path.resolve(process.cwd(), p)

// vue.config.js
let vueConfig: VueCliOptions = {}
try {
  vueConfig = require(resolve('vue.config.js')) || {}
} catch (e) {
  /**/
}

const pluginOptions = vueConfig.pluginOptions || {}
const runtimeCompiler = vueConfig.runtimeCompiler
const viteOptions: Options = pluginOptions.vite || {}
const extraPlugins = viteOptions.plugins || []

if (viteOptions.alias) {
  console.log(
    `[${name}]: pluginOptions.vite.alias is deprecated, will auto-resolve from chainWebpack / configureWebpack`,
  )
}

const chainableConfig = new Config()
if (vueConfig.chainWebpack) {
  vueConfig.chainWebpack(chainableConfig)
}
// @see {@link https://github.com/vuejs/vue-cli/blob/4ce7edd3754c3856c760d126f7fa3928f120aa2e/packages/%40vue/cli-service/lib/Service.js#L248}
const aliasOfChainWebpack = chainableConfig.resolve.alias.entries()
// @see {@link temp/webpack*.js & temp/vue.config.js}
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
  // @see {@link https://github.com/vuejs/vue-cli/blob/0dccc4af380da5dc269abbbaac7387c0348c2197/packages/%40vue/cli-service/lib/config/base.js#L70}
  vue: runtimeCompiler ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.runtime.esm.js',
  '@': resolve('src'),
  '~': '',
  // high-priority for user-provided alias
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
    alias,
  },
  plugins,
  optimizeDeps: viteOptions.optimizeDeps,
})
