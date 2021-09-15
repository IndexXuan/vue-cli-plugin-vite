module.exports = () => {
  return {
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
      overlay: false,
    },
    configureWebpack: {
      // plugins: [require('unplugin-icons/webpack')({ compiler: 'vue2' })],
    },
    pluginOptions: {
      vite: {
        disabledTypeChecker: true,
        // plugins: [require('unplugin-icons/vite')({ compiler: 'vue2' })],
      },
    },
  }
}
