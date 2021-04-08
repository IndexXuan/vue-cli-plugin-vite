module.exports = {
  devServer: {
    port: Number(process.env.PORT),
    disableHostCheck: true,
  },
  pages: {
    index: {
      entry: 'src/pages/index/main.ts',
      title: '首页',
      template: './src/pages/index/main.html',
    },
    subpage: 'src/pages/subpage/main.ts',
  },
}
