module.exports = {
  devServer: {
    port: Number(process.env.PORT),
    disableHostCheck: true,
  },
  pages: {
    index: 'src/pages/index/main.ts',
  },
}
