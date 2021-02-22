import { Plugin } from 'vite'
import { VueViteOptions } from 'vite-plugin-vue2'

export interface Options {
  alias: Record<string, string>
  plugins: Plugin[]
  vitePluginVue2Options: VueViteOptions
}
