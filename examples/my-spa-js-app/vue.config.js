module.exports = () => {
  return {
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
      overlay: false,
    },
    pluginOptions: {
      vite: {
        disabledTypeChecker: true,
      },
    }
  }
}
