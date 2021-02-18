const { writeMainDotHtml4EachEntry } = require('../lib/utils')

module.exports = (api, options = {}) => {
  const hasRome = api.hasPlugin('@nibfe/vue-cli-plugin-project-build')
  const pkg = {
    scripts: {
      dev: `${hasRome ? 'ROME=on ' : 'ROME=off '}node ./bin/vite_dev`,
      'build:vite': 'VITE_BUILD=true MODERN=true yarn dev',
    },
  }
  api.extendPackage(pkg)

  // 渲染模板文件
  api.render('./template')

  // 强行变更 .eslintrc 文件
  api.onCreateComplete(() => {
    writeMainDotHtml4EachEntry(api.resolve('.'))
    api.exitLog(
      '请执行 yarn dev 尝试启动 vite，注意目前仅可以在 dev 时候使用，不可用于 build',
      'info',
    )
  })
}
