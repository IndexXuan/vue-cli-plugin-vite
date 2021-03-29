const { writeHtmlFromPublic, writeMainDotHtml4EachEntry } = require('../lib/utils')

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
    const root = api.resolve('.')
    if (options.htmlInitMethod === 'vue-cli') {
      writeHtmlFromPublic(root)
    } else {
      writeMainDotHtml4EachEntry(root)
    }
    api.exitLog('use vite for development by `yarn vite`', 'info')
  })
}
