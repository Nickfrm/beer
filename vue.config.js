const path = require('path')
const projectRoot = path.resolve(__dirname)

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': `${projectRoot}/src`,
        'styles': `${projectRoot}/src/styles`
      }
    }
  },

  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 5000
  }
}
