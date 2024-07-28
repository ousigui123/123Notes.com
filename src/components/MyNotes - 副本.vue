<template>
  <v-container fluid>
	<draggable v-model="items" class="drag-container">	
      <div v-for="(item,i) in items" :key="i" class="drag-item">
        <v-card elevation="15" :color="item.color" min-width="350px" min-height="408px"  max-width="700px" max-height="700px">          
          <quill-editor ref="myQuillEditor" v-model="item.value" :options="editorOption" @blur="saveNote" @focus="onEditorFocus($event)" @change="saveNote"/>
          <v-row  align="center" justify="end">
            <v-card-title><v-icon x-small>{{item.icon}}</v-icon><v-icon small @click="delNote(i)">mdi-delete</v-icon></v-card-title>
          </v-row>
        </v-card>
      </div>	
  </draggable>
	
    <div style="display: flex; flex-wrap: wrap;">
      <div class="advClass">
        <v-card elevation="15" color="#26c6da" width="350px" height="130px">          
          <v-card-title><v-icon>mdi-share-variant-outline</v-icon>About Us</v-card-title>
          <v-card-text>
             <a href="http://www.123Notes.com" target="_blank">123Notes.com--StickyNotes</a>
             <div><pre><a href="https://github.com/ousigui123/stickynotes123" target="_blank">OpenSource on Gitbub</a></pre></div>
          </v-card-text>
        </v-card>
      </div>
      <div class="advClass">
        <v-card elevation="15" color="#38c6ad" width="350px" height="130px">          
          <v-card-title><v-icon>mdi-television-box</v-icon>Advert</v-card-title>
          <v-card-text>
             <a href="https://www.google.com" target="_blank">Google</a>
             <div><pre><a href="https://www.baidu.com" target="_blank">Baidu</a></pre></div>
          </v-card-text>
        </v-card>
      </div>
    </div>
	
    <div>
      <v-card class="py-0 px-0" color="rgba(0, 0, 0, .3)" min-width="30" style="position: fixed; bottom: 120px; right: -15px; bottom-radius: 2px; z-index: 1;">
        <v-btn @click="shiftTheme"><v-icon x-samll>mdi-theme-light-dark</v-icon></v-btn>
      </v-card>
	</div>
	
	<div>
      <v-card class="py-1 px-1" color="rgba(0, 0, 0, .3)" min-width="100" style="position: fixed; bottom: 20px; right: -25px; bottom-radius: 8px; z-index: 1;">
        <v-btn @click="addMyNote"><v-icon large>mdi-plus</v-icon></v-btn>
      </v-card>
	</div>
	
	<!-- <div><pre><a href="https://github.com/ousigui123/stickynotes123" target="_blank">OpenSource on Gitbub</a></pre></div> -->
  </v-container>  
</template>

<script>
  import localforage from 'localforage'
  
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  
  import draggable from 'vuedraggable'
  
  import Quill from 'quill'
  import ImageResize from 'quill-image-resize-module'
  import { ImageDrop } from 'quill-image-drop-module'
  Quill.register('modules/imageResize', ImageResize)
  Quill.register('modules/imageDrop', ImageDrop)
  
  export default {
    name: 'MyNotes',
    components: {
      quillEditor,draggable,
    },
    data: () => ({
       items: [],
       iniItems: [
        {
           id: 1,
           icon: 'mdi-pin',
           color: '#FFFF8D',
           value: '',
        },
		{
           id: 2,
           icon: 'mdi-balloon',
           color: '#FFF9C4',
           value: '',
        },
		{
           id: 3,
           icon: 'mdi-map-marker',
           color: '#B9F6CA',
           value: '',
        },
		{
           id: 4,
           icon: 'mdi-pin',
           color: '#FFCDD2',
           value: '',
        },
		{
           id: 5,
           icon: 'mdi-balloon',
           color: '#FFFF8D',
           value: '',
        },
		{
           id: 6,
           icon: 'mdi-pin',
           color: '#FFFF8D',
           value: '',
        },
      ],
      
      editorOption: {
        theme: 'snow',
        modules: {
         toolbar: [
           ['bold','strike','clean'],
           [{list: 'ordered'},{list: 'check'}],           
           //[{color:[]} ,{background:[]}],
           [{color:[]}],
           ['image'],           
         ],
         imageDrop: true,
         imageResize: {displaySize: true},
        },
        placeholder: 'Input text...',
      },
 
      adEditorOption: {
        theme: 'snow',
        modules: {toolbar: [ ],},        
      },
 
    }),
	
	mounted: function () {
      this.resumeTheme()
      this.getNoteList()
      // this.editor()
	},
	
	methods: {
      getNoteList () {
        localforage.getItem('items')
          .then( value => {
            if (value === null ) {
              this.items = this.iniItems
			} else {
              const tempItems =JSON.parse(value)
              this.items =tempItems
			}
          })
          .catch(error => {
            console.log(error)
          })		   		  
      },
      addMyNote () {
        const iId = this.items.length
        this.items.push({
          id: iId +1,
          icon: this.iniItems[iId % 5].icon,
          color: this.iniItems[iId % 5].color
        })
      },
      delNote (i) {
        this.items.splice(i,1)
		this.saveNote()
      },
      saveNote () {
        localforage.setItem('items',JSON.stringify(this.items))
          .then (() => {
            console.log('save success')
          })
          .catch (error => {
            console.log(error)
          })
      },
      editor(){
        //return this.$refs.myQuillEditor.quill
      },
      onEditorBlur(quill){
        console.log(quill)
      },
      onEditorFocus(quill){
        console.log(quill)
      },
      onEditorChange({quill,html,text}){
       this.content=html
       console.log(quill,html,text)
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
 
<style>
.ql-editor {
  scrollbar-width: none;   
}
.ql-container {
      line-height: normal !important;
      height: 340px;
      width: 350px;
      min-height: 408px;
      max-height: 620px;
      min-width: 350px;
      max-width: 700px;
      overflow: hidden;
      resize: both;	 
    }
	
.drag-container {
  display: flex; flex-wrap: wrap;   
}

.drag-item {
  cursor: move;
  margin-left: 30px;  
  margin-right: 30px;   
  margin-top: 25px;
  margin-bottom: 30px; 
}	

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
  display: none;
}


.advClass {  
  margin-left: 30px;  
  margin-right: 30px;   
  margin-top: 25px;
  margin-bottom: 30px; 
}	
 

</style>