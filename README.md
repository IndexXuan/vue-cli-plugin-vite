# Vite for vue-cli projects

> Use Vite Today, out-of-box for vue-cli projects without any codebase modifications.

## Usage
```sh
vue add vite
```
the plugin\'s generator will write some `main.html` for corresponding main.{js,ts}, since vite need html file for dev-server entry file


## Motivation
- We have lots of exists vue-cli(3.x / 4.x) projects.
- In Production: vue-cli based on webpack is still the best practice for bundling webapp(with code spliting、legecy-build for old browsers).
- In Development: instant server start and lightning fast HMR by vite is interesting.
- Why not we use them together ?


## Options
```js
// vue.config.js
{
  // ...
  pluginsOptions: {
    vite: {
      /**
       * will deprecated when we can auto resolve alias from vue.config.js(WIP)
       * @ is setted by the plugin, you can set others used in your projects, like @components
       * Record<string, string>
       * @default {}
       */
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
      },
      /**
       * Plugin[]
       * @default []
       */
      plugins: [], // other vite plugins list, will be merge into this plugin\'s underlying vite.config.ts
    }
  },
}
```


## Underlying principle
- **NO Extra** files、code and dependencies injected
    - injected corresponding main.html
        - SPA: `projectRoot/main.html`
        - MPA: `src/pages/*/main.html`(s)
    - injected one devDependency `vue-cli-plugin-vite`
    - injected one line code in package.json#scripts#dev and one file at `bin/vite_serve`
- auto-resolved as much options as we can from `vue.config.js` (publicPath, alias, outputDir...)
- compatible the differences between vue-cli and vite(environment variables...)


### Differences between vue-cli and vite

| Dimension                 |         vue-cli     |     vite           |
|---------------------------|---------------------|--------------------|
|     Plugin                | 1. based on webpack. <br />2. have service and generator lifecycles. <br />3. hooks based on each webpack plugin hooks | 1. based on rollup. <br />2. no generator lifecycle. <br />3. universal hooks based on rollup plugin hooks and vite self designed |
|     Environment Variables | 1. loaded on process.env. <br />2. prefixed by `VUE_APP_`. <br />3. client-side use `process.env.VUE_APP_XXX` by webpack definePlugin | 1. not loaded on process.env. <br />2. prefixed by `VITE_`. <br />3. client-side use `import.meta.env.VITE_XXX` by vite inner define plugin |
|     Entry Files           | 1. main.{js,ts}.    | 1. *.html          |
|     Config File           | 1. vue.config.js    | 1. vite.config.ts. <br />2. support use --config to locate |
|     MPA Support           | 1. native support by `options.pages`. <br />2. with history rewrite support | 1. native support by `rollupOptions.input` |
|     Import CSS from node_modules | 1. support by `css-loader`, use `~module/dist/index.css`. | 1. native support by vite, use 'module/dist/index.css' directly |


## TODO
- ✅ Environment Variables Compatible
    - load to process.env
    - recognize `VUE_APP_` prefix
    - define as `process.env.VUE_APP_XXX` for client-side
- ⬜️ vue.config.js Options auto-resolved
    - ✅ vite#base - resolved from vue.config.js#`publicPath || baseUrl`
    - ✅ vite#css - resolved from vue.config.js#`css`
        - ✅ preprocessorOptions: `css.loaderOptions`
    - ✅ vite#server- resolved from vue.config.js#`devServer`
        - ✅ host - resolved from `process.env.DEV_HOST || devServer.public`
        - ✅ port - resolved from `Number(process.env.PORT) || devServer.port`
        - ✅ https - resolved from `devServer.https`
        - ✅ open - resolved from `process.platform === 'darwin' || devServer.open`
        - ✅ proxy - resolved from `devServer.proxy`
    - ✅ vite#build
        - ✅ outDir - resolved from vue.config.js#`outputDir`
        - ✅ cssCodeSplit - resolved from `css.extract`
        - ✅ sourcemap - resolved from `process.env.GENERATE_SOURCEMAP === 'true' || productionSourceMap || css.sourceMap`
    - ⬜️ Alias - resolved from configureWebpack or chainWebpack(WIP)


## Troubleshooting

### Custom Style missing fonts
- e.g. element-plus: https://element-plus.gitee.io/#/en-US/component/custom-theme

```scss
/* theme color */
$--color-primary: teal;

/* icon font path, required */
$--font-path: '~element-plus/lib/theme-chalk/fonts'; // changed to 'path/to/node_modules/element-plus/lib/theme-chalk/fonts;'

@import "~element-plus/packages/theme-chalk/src/index"; // remove '~', css-loader support it
```

### Vite Build Support ?
- Currently only support vite dev for development, you should still use yarn build(vue-cli-service build)
- But you can use `BUILD=true MODERN=true yarn dev` to invoke vite build(with or without legecy build)


## Relevant
- [vite-plugin-env-compatible](https://github.com/IndexXuan/vite-plugin-env-compatible)
- [vite-plugin-vue-cli](https://github.com/IndexXuan/vite-plugin-vue-cli)
- [vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa)
