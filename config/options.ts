import { Plugin } from 'vite'
import { VueViteOptions } from 'vite-plugin-vue2'

export interface Options {
  /**
   * @deprecated
   * alias
   */
  alias: Record<string, string>
  /**
   * extra vite plugins
   * @default []
   */
  plugins: Plugin[]
  /**
   * vite-plugin-vue2 Options
   * @see {@link https://github.com/underfin/vite-plugin-vue2#options}
   * @default {}
   */
  vitePluginVue2Options: VueViteOptions
}
