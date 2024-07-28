<template>
  <v-container fluid>
	<draggable v-model="items" class="drag-container">	
      <div v-for="(item,i) in items" :key="i" class="drag-item">
        <v-card elevation="15" :color="item.color" min-width="350px" min-height="408px"  max-width="700px" max-height="700px">          
          <quill-editor ref="myQuillEditor" v-model="item.value" :options="editorOption" @blur="saveNote(currentPageNo)" @focus="onEditorFocus($event)" @change="saveNote(currentPageNo)"/>
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
             <div><pre><a href="https://github.com/ousigui123/123Notes.com" target="_blank">OpenSource on Gitbub</a></pre></div>
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
	
	
	<div class="folder-div">      
      <div  v-for="(item) in folderItems" :key="item">
       <!--<v-card class="py-1 px-0  folder-item" elevation="15" :color="item.color" @click="changePage(item.id)">-->
        <v-card class="py-1 px-0" :class="[item.sel?'folder-item-sel':'folder-item']" elevation="15" :color="item.color" @click="changePage(item.id)">
        <v-card-text>{{item.id}}</v-card-text>
       </v-card>     
      </div>
    </div>

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
  import '../css/style.css'
  
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
   
      currentPageNo: '1',
      
      folderItems: [
       {id:'1',color:'#dddddd',sel:true,},{id:'2',color:'#aadddd',sel:false,},{id:'3',color:'#dddddd',sel:false,},{id:'4',color:'#eecc00',sel:false,},{id:'5',color:'#dddddd',sel:false,},{id:'6',color:'#dddddd',sel:false,},{id:'7',color:'#ddaaaa',sel:false,},{id:'8',color:'#dddddd',sel:false,},{id:'9',color:'#dddddd',sel:false,},{id:'A',color:'#888888',sel:false,},{id:'B',color:'#8888aa',sel:false,},{id:'C',color:'#66dddd',sel:false,},{id:'D',color:'#dddddd',sel:false,},{id:'E',color:'#dddddd',sel:false,},{id:'F',color:'#dddddd',sel:false,},{id:'G',color:'#dddddd',sel:false,},{id:'H',color:'#11dd55',sel:false,},{id:'I',color:'#dddddd',sel:false,},{id:'J',color:'#dddddd',sel:false,},{id:'K',color:'#9900dd',sel:false,},
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
      this.getNoteList(this.currentPageNo)
      // this.editor()
	},
	
	methods: {
      getNoteList (pageNo) {
        localforage.getItem(pageNo)
          .then( value => { 
            if (value === null ) {
              this.items = this.iniItems.splice(0)
              this.currentPageNo = pageNo
			} else {
              const tempItems =JSON.parse(value)
              this.items =tempItems
              this.currentPageNo = pageNo
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
		this.saveNote(this.currentPageNo)
      },
      saveNote (pageNo) {
        localforage.setItem(pageNo,JSON.stringify(this.items))
          .then (() => {
            console.log('save success')
          })
          .catch (error => {
            console.log(error)
          })
      },
      changePage(pageNo) {                
		this.getNoteList(pageNo) 		
        //this.folderItems = this.iniFolderItems
        for (let i=0;i<this.folderItems.length; i++){          
          if (this.folderItems[i].id == pageNo ){
            this.folderItems[i].sel = true			
            //this.$set(this.folderItems[i],'sel', true)
            //break
          }else{
            this.folderItems[i].sel = false	 
          }
        }		
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
 