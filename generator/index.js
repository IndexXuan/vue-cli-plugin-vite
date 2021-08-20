const pkgJson = require('../package.json')

module.exports = (api, options = {}) => {
  // 1. extend package
  const pkg = {
    scripts: {
      // Set the framework cli config file used by the project
      vite: `FRAMEWORK_CLI_CONFIG_FILE=vue.config.js node ./bin/vite`,
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
