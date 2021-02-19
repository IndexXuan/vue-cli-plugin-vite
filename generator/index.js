const { writeMainDotHtml4EachEntry } = require('../lib/utils')

module.exports = (api, options = {}) => {
  // 1. extend package
  const pkg = {
    scripts: {
      vite: 'node ./bin/vite',
    },
  }
  api.extendPackage(pkg)

  // 2. render template
  api.render('./template')

  // 3. logger
  api.onCreateComplete(() => {
    writeMainDotHtml4EachEntry(api.resolve('.'))
    api.exitLog('use vite for development by `yarn vite`', 'info')
  })
}
