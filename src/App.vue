<template>
  <v-app>   
    <v-main>

        <CalendarNotes v-if="viewIndex == 1 "/>
        <MyPaint v-else-if="viewIndex == 2"/>
        <MyNotes v-else/>

		<div style="display: flex; flex-wrap: wrap;">
          <div class="advClass">
            <v-card elevation="15" color="#26c6da" width="350px" height="130px">          
              <v-card-title><v-icon>mdi-share-variant-outline</v-icon>About Us</v-card-title>
              <v-card-text>
                <a href="http://www.123Notes.com" target="_blank">123Notes.com--StickyNotes</a>
                <div><pre><a href="https://github.com/ousigui123/123Notes.com" target="_blank">OpenSource on Gitbub ousigui@gmail.com</a> </pre></div>
              </v-card-text>
            </v-card>
          </div>
 
          <div class="advClass">
            <v-card elevation="15" color="#38c6ad" width="350px" height="130px">          
              <v-card-title><v-icon>mdi-television-box</v-icon>Ads</v-card-title>
              <v-card-text>
                 <a href="https://www.google.com" target="_blank">Google</a>
                 <div><pre><a href="https://www.baidu.com" target="_blank">Baidu</a></pre></div>
              </v-card-text>
			</v-card>
          </div>
		</div>
		
        <!--<div>
          <v-card class="py-0 px-0" color="rgba(0, 0, 0, .3)" min-width="25" style="position: fixed; bottom: 480px; right: -10px; bottom-radius: 1px; z-index: 3;">
            <v-btn @click="shiftPaintView"><v-icon x-samll>mdi-key-chain</v-icon><v-icon x-samll>mdi-bitcoin</v-icon> </v-btn>
          </v-card>
        </div>-->
		
        <div>
          <v-card class="py-0 px-0" color="rgba(0, 0, 0, .3)" min-width="25" style="position: fixed; bottom: 240px; right: -10px; bottom-radius: 1px; z-index: 3;">
            <v-btn @click="shiftPaintView"><v-icon x-samll>mdi-draw-pen</v-icon></v-btn>
          </v-card>
        </div>
		
        <div>
          <v-card class="py-0 px-0" color="rgba(0, 0, 0, .3)" min-width="25" style="position: fixed; bottom: 180px; right: -15px; bottom-radius: 2px; z-index: 1;">
            <v-btn @click="shiftCalendarView"><v-icon x-samll>mdi-calendar-month-outline</v-icon></v-btn>
          </v-card>
        </div>
		
        <div>
          <v-card class="py-0 px-0" color="rgba(0, 0, 0, .3)" min-width="30" style="position: fixed; bottom: 120px; right: -15px; bottom-radius: 2px; z-index: 1;">
            <v-btn @click="shiftTheme"><v-icon x-samll>mdi-weather-night</v-icon></v-btn>
          </v-card>
        </div>
 
    </v-main>
  </v-app>
</template>

<script>
//import '@/styles/overrides.sass'
import './css/style.css'
import MyNotes from './components/MyNotes'
import CalendarNotes from './components/CalendarNotes'
import MyPaint from './components/MyPaint'

export default {
  name: 'App',

  components: {
    MyNotes,CalendarNotes,MyPaint,
  },
  metaInfo: {
      title: '123Notes.com --Sticky Notes,Note,OneNote,Keep,Sticky Note',
      titleTemplate: '%s | 123Notes',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'keywords', content: 'Sticky Notes,123 Notes,Note,Sticky Note,OneNote,Keep' },
		{ name: 'description', content: 'Sticky Notes,123 Notes,Note,Sticky Note,OneNote,Keep' },
		{ charset: 'utf-8' },
      ],
  },
 
  data: () => ({    
	viewIndex: 0,
  }),
  

  mounted: function () {      
    this.resumeView()
    this.resumeTheme()      
  },

  methods: {
      shiftCalendarView() {
        if (this.viewIndex == 1 ) {this.viewIndex = 0}
		else {this.viewIndex = 1}
        localStorage.setItem('viewIndex',this.viewIndex)
      },

      shiftPaintView() {
        if (this.viewIndex == 2 ) {this.viewIndex = 0}
		else {this.viewIndex = 2}
        localStorage.setItem('viewIndex',this.viewIndex)
      },

      resumeView () {        
        this.viewIndex = localStorage.getItem('viewIndex') 
        if (this.viewIndex == null ){ this.viewIndex = 0 }
      },

      shiftTheme (){
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark		
        let themeDark = this.$vuetify.theme.dark ? 1 : 0
		localStorage.setItem('themeDark',themeDark)
      },

      resumeTheme () {
        const themeDark = localStorage.getItem('themeDark')
        this.$vuetify.theme.dark = (themeDark == 1)        
      },
  },
 
}
</script>
