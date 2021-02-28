import { UserConfig, Plugin } from 'vite'
import { VueViteOptions } from 'vite-plugin-vue2'

export interface Options {
  /**
   * @deprecated
   * alias will be auto-resolve from vue.config.js's configureWebpack & chainWebpack
   */
  alias: Record<string, string>
  /**
   * vite-plugin-vue2 Options
   * @see {@link https://github.com/underfin/vite-plugin-vue2#options}
   * @default {}
   */
  vitePluginVue2Options: VueViteOptions
  /**
   * extra vite plugins
   * @default []
   */
  plugins: Plugin[]
  /**
   * vite optimizeDeps options
   */
  optimizeDeps: UserConfig['optimizeDeps']
}
