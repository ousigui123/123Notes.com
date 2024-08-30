const { defineConfig } = require('@vue/cli-service')

const webpack = require('webpack')


module.exports = defineConfig({
  transpileDependencies: true,
  /*chainWebpack: config =>{
    config.plugin('html').tap(args => {
        args[0].title ="123Notes.com"
        return args
	  })	
  },*/

  productionSourceMap: false,
  
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js',
      }),      
    ],
    
    externals: {
      'vue': 'Vue',
      'vuetify': 'Vuetify',
      'crypto-js': 'CryptoJS',
      'fabric': 'fabric',
      'localforage': 'localforage',
      'vuedraggable': 'vuedraggable',
	  'quill': 'Quill',
      'vue-quill-editor': 'VueQuillEditor',
	  'quill-emoji': 'QuillEmoji',
	  //'ckeditor5': 'editor',
	},
   
   
  },
  
 
  
})
