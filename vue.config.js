const { defineConfig } = require('@vue/cli-service')

const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config =>{
    config
      .plugin('html')
      .tap(args => {
        args[0].title ="123Notes.com"
        return args
	  })
  },
  
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js',
      })
    ],
  },
  
})
