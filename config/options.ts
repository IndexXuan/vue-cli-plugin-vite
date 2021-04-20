import type { UserConfig, Plugin } from 'vite'
import type { VueViteOptions } from 'vite-plugin-vue2'
import type vueJsx from '@vitejs/plugin-vue-jsx'

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
   * @vitejs/plugin-vue-jsx Options
   * @see {@link https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx#options}
   * @default {}
   */
  vitePluginVue3Options: {
    jsx?: Parameters<typeof vueJsx>[0]
  }
  /**
   * extra vite plugins
   * @default []
   */
  plugins: (Plugin | Plugin[])[]
  /**
   * vite optimizeDeps options
   */
  optimizeDeps: UserConfig['optimizeDeps']
}
