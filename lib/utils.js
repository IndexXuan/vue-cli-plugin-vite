const fs = require('fs')
const fg = require('fast-glob')
const path = require('path')
const chalk = require('chalk')

// can extend info/success/error methods if we need to
const warning = (...args) => {
  console.info(chalk.yellow('\n', ...args))
}

exports.writeMainDotHtml4EachEntry = (root) => {
  const scanDir = 'src/pages'
  const scanFile = 'main.{js,ts}'
  const filePaths = fg.sync(`${scanDir}/*/${scanFile}`.replace('//', '/'), {
    cwd: root,
    onlyFiles: true,
  })
  // SPA
  if (filePaths.length === 0) {
    const htmlTargetPath = './index.html'
    // support no ext
    const jsPath = '/src/main'
    fs.writeFileSync(
      htmlTargetPath,
      `<!-- for vite development entry file only -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>index</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${jsPath}"></script>
  </body>
</html>
      `,
    )
  } else {
    filePaths.forEach((jsPath) => {
      const htmlTargetPath = jsPath.replace(/main.(.*)/, 'main.html')
      const parts = jsPath.split('/')
      const title = parts[2]
      fs.writeFileSync(
        htmlTargetPath,
        `<!-- for vite development entry file only -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/${jsPath}"></script>
  </body>
</html>
      `,
      )
    })
  }
}

const replaceWpPuglinVar = (htmlStr) => {
  const wpPluginReg = /(htmlWebpackPlugin\.options\.[^ ]*)( )?(.*%>)/g

  if (wpPluginReg.test(htmlStr)) {
    warning(
      '[vue-cli-plugin-vue]: htmlWebpackPlugin.options.xx are replaced with normal strings. Please replace them with the Vite Env Variables',
    )
    return htmlStr.replace(wpPluginReg, `'$1'$2$3`)
  }

  return htmlStr
}

exports.writeHtmlFromPublic = (root) => {
  // SPA
  const publicHtmlPath = path.resolve(root, 'public/index.html')
  const isExists = fs.existsSync(publicHtmlPath)

  if (!isExists) {
    warning('[vue-cli-plugin-vue]: Can not find public/index.html, html will be created by default')
    exports.writeMainDotHtml4EachEntry(root)
    return
  }

  let htmlStr = fs.readFileSync(publicHtmlPath, { encoding: 'utf8' })

  htmlStr = replaceWpPuglinVar(htmlStr)

  const moduleStr = '<script type="module" src="/src/main"></script>\n</body>'
  htmlStr = htmlStr.replace('</body>', moduleStr)

  const targetHtmlPath = path.resolve(root, './index.html')
  fs.writeFileSync(targetHtmlPath, htmlStr)
  // Todo: MPA
}
