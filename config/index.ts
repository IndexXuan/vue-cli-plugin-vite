import { defineConfig } from 'vite'
import semver from 'semver'
import envCompatible from 'vite-plugin-env-compatible'
import htmlTemplate from 'vite-plugin-html-template'
import vueCli from 'vite-plugin-vue-cli'
import type { VueCliOptions } from 'vite-plugin-vue-cli'
import mpa from 'vite-plugin-mpa'
import path from 'path'
import chalk from 'chalk'
import type { Options } from './options'
import { name } from '../package.json'

const resolve = (p: string) => path.resolve(process.cwd(), p)

// vue.config.js
let vueConfig: VueCliOptions = {}
try {
  vueConfig = require(resolve('vue.config.js')) || {}
} catch (e) {
  if (process.env.VITE_DEBUG) {
    console.error(chalk.redBright(e))
  }
  /**/
}

/**
 * @see {@link https://github.com/vuejs/vue-cli/blob/aad72cfa7880a0e327be06b3b9c3ac3d3b3c9abc/packages/%40vue/babel-preset-app/index.js#L124}
 */
let vueVersion = 2
try {
  const Vue = require('vue')
  vueVersion = semver.major(Vue.version)
} catch (e) {}

const pluginOptions = vueConfig.pluginOptions || {}
const viteOptions: Options = pluginOptions.vite || {}
const extraPlugins = viteOptions.plugins || []

// TODO: remove it when v1.0.0 stable
if (viteOptions.alias) {
  console.log(
    chalk.cyan(
      `[${name}]: pluginOptions.vite.alias is deprecated, will auto-resolve from chainWebpack / configureWebpack`,
    ),
  )
}

const useMPA = Boolean(vueConfig.pages)
const vitePluginVue2Options = viteOptions.vitePluginVue2Options || {}
const vitePluginVue3Options = viteOptions.vitePluginVue3Options || {}

/**
 * @see {@link https://vitejs.dev/config/}
 */
export default defineConfig({
  plugins: [
    envCompatible(),
    // auto infer pages
    htmlTemplate(vueConfig.pages ? { pages: vueConfig.pages } : undefined),
    vueCli(),
    // lazyload plugin for vue-template-compiler mismatch errors.
    vueVersion === 2
      ? require('vite-plugin-vue2')['createVuePlugin'](vitePluginVue2Options)
      : [
          require('@vitejs/plugin-vue')(),
          vitePluginVue3Options.jsx
            ? require('@vitejs/plugin-vue-jsx')(vitePluginVue3Options.jsx)
            : undefined,
        ],
    useMPA ? mpa() : undefined,
    ...extraPlugins,
  ],
  optimizeDeps: viteOptions.optimizeDeps,
})
