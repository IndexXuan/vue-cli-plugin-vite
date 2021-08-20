const pkgJson = require('../package.json')

module.exports = (api, options = {}) => {
  // 1. extend package
  const pkg = {
    scripts: {
      vite: `node ./bin/vite --config-file=vue.config.js`,
    },
  }
  api.extendPackage(pkg)

  // 2. render template
  api.render('./template', { pkgName: pkgJson.name })

  // 3. logger
  api.onCreateComplete(() => {
    api.exitLog('use vite for development by `yarn vite`', 'info')
  })
}
