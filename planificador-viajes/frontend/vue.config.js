const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      let vuetify = args[0]['process.env'].vuetify
      vuetify = 'vuetify'
      args[0]['process.env'].vuetify = JSON.stringify(vuetify)
      return args
    })
  }
})