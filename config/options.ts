import type { UserConfig, Plugin } from 'vite'
import type { VueViteOptions } from 'vite-plugin-vue2'
import type vueJsx from '@vitejs/plugin-vue-jsx'

export interface Options {
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
   * @default { include: ['vue'] }
   */
  optimizeDeps: UserConfig['optimizeDeps']
  /**
   * do not use html-template, use real-world html entry.(e.g. projectRoot/index.html)
   * @see {@link https://github.com/IndexXuan/vue-cli-plugin-vite/issues/28#issuecomment-844664231}
   * @default false
   */
  disabledHtmlTemplate: boolean
}
