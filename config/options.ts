import type { UserConfig, Plugin } from 'vite'
import type { VueViteOptions } from 'vite-plugin-vue2'
import type vueJsx from '@vitejs/plugin-vue-jsx'

export interface Options {
  /**
   * extra vite plugins
   * @default []
   */
  plugins: (Plugin | Plugin[])[]
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
   * do not enable vite-plugin-checker and vite-plugin-check-vls(since v1.2.0)
   * @see {@link https://github.com/fi3ework/vite-plugin-checker}
   * disabled it for performance if necessary.
   * @default false
   */
  disabledTypeChecker: boolean
  /**
   * do not enable eslint
   * @see {@link https://github.com/gxmari007/vite-plugin-eslint}
   * disabled it for performance if necessary.
   * @default false
   */
  disabledLint: boolean
  /**
   * enable css-loader url resolve compat
   * disabled it if you do not use `~@/assets/logo.png` for better performance.
   * @default true
   */
  cssLoaderCompat: boolean
  /**
   * vite optimizeDeps options
   * @default { include: ['vue'] }
   */
  optimizeDeps: UserConfig['optimizeDeps']
  /**
   * do not use html-template, use real-world html entry.(e.g. projectRoot/index.html)
   * @see {@link https://github.com/IndexXuan/vue-cli-plugin-vite/issues/28#issuecomment-844664231}
   * @deprecated
   * @default false
   */
  disabledHtmlTemplate: boolean
}
