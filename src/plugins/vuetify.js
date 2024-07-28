import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
//import ripple from 'vuetify/lib/directives/ripple'
//import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#E91E63',
        secondary: '#9C27B0',
        accent: '#E91E63',
        error: '#FF5252',
        info: '#00CAE3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      light: {
        primary: '#007BFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
});
