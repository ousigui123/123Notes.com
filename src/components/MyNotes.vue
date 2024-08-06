<template>
  <v-container fluid>
  
	<div class="folder-div">      
      <div  v-for="(item) in folderItems" :key="item">       
        <v-card class="py-1 px-0" :class="[item.sel?'folder-item-sel':'folder-item']" elevation="15" :color="item.color" @click="changePage(item.id)">
        <v-card-text>{{item.id}}</v-card-text>
       </v-card>     
      </div>
    </div>
  
	<draggable v-model="items" class="drag-container" animation="300" >	
      <div v-for="(item,i) in items" :key="i" class="drag-item">
        <v-card elevation="15" :color="item.color" min-width="350px" min-height="408px"  max-width="700px" max-height="700px" light>          
          <quill-editor ref="myQuillEditor" v-model="item.value" :options="editorOption" @blur="saveNote(currentPageNo)"/>
          <v-row  align="center" justify="end">
            <v-card-title>
               <v-icon small @click="doNothing()">mdi-content-save</v-icon>
               <v-icon x-small @click="doCopy(i)">mdi-content-copy</v-icon>
               <v-icon x-small @click="doNothing()">mdi-share-variant</v-icon>
               
            <v-menu offset-y>
               <template v-slot:activator="{ on, attrs }">
                  <v-icon   small  v-bind="attrs"  v-on="on">mdi-tshirt-crew-outline </v-icon>
               </template>
               <v-list>
                  <v-list-item>        
                    <v-avatar color="#FFFF8D" size="20" @click="setNoteBgColor(item,'#FFFF8D')"></v-avatar> <v-avatar size="3"/>                
                    <v-avatar color="#FFF9C4" size="20" @click="setNoteBgColor(item,'#FFF9C4')"></v-avatar> <v-avatar size="3"/>             
                    <v-avatar color="#B9F6CA" size="20" @click="setNoteBgColor(item,'#B9F6CA')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="#FFCDD2" size="20" @click="setNoteBgColor(item,'#FFCDD2')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="red" size="20" @click="setNoteBgColor(item,'red')"></v-avatar> <v-avatar size="3"/>				 
                    <v-avatar color="green" size="20" @click="setNoteBgColor(item,'green')"></v-avatar> <v-avatar size="3"/>			
                    <v-avatar color="yellow" size="20" @click="setNoteBgColor(item,'yellow')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="pink" size="20" @click="setNoteBgColor(item,'pink')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="blue" size="20" @click="setNoteBgColor(item,'blue')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="purple" size="20" @click="setNoteBgColor(item,'purple')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="teal" size="20" @click="setNoteBgColor(item,'teal')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="orange" size="20" @click="setNoteBgColor(item,'orange')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="amber" size="20" @click="setNoteBgColor(item,'amber')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="lime" size="20" @click="setNoteBgColor(item,'lime')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="cyan" size="20" @click="setNoteBgColor(item,'cyan')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="brown" size="20" @click="setNoteBgColor(item,'brown')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="grey" size="20" @click="setNoteBgColor(item,'grey')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="#212121" size="20" @click="setNoteBgColor(item,'#212121')"></v-avatar> <v-avatar size="3"/>
                    <v-avatar color="#FAFAFA" size="20" @click="setNoteBgColor(item,'#FAFAFA')"></v-avatar> <v-avatar size="3"/>
                  </v-list-item>              
                </v-list>
            </v-menu>

               <v-icon x-small>{{item.icon}}</v-icon>
               <v-icon small @click="delNote(i)">mdi-delete</v-icon>
            </v-card-title>
          </v-row>
        </v-card>
      </div>	
  </draggable>
	
    <div>
      <v-card class="py-2 px-1" elevation="2" width="30px" style="position: fixed; top: -3px; right: -2px;"> 
          <v-icon dense @click="doOpenFile">mdi-folder-open-outline</v-icon>
          <v-icon dense @click="doSaveAsFile">mdi-share</v-icon>
      </v-card>
	</div>
	
	<div>
      <v-card class="py-1 px-1" color="rgba(0, 0, 0, .3)" min-width="100" style="position: fixed; bottom: 20px; right: -25px; bottom-radius: 8px; z-index: 1;">
        <v-btn @click="addMyNote"><v-icon large>mdi-plus</v-icon></v-btn>
      </v-card>
	</div>
	
	

  </v-container>  
</template>

<script>
  import localforage from 'localforage'
  
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor,Quill} from 'vue-quill-editor'
  
  import draggable from 'vuedraggable'
  
  //import Quill from 'quill'
  import ImageResize from 'quill-image-resize-module'
  import { ImageDrop } from 'quill-image-drop-module'
  Quill.register('modules/imageResize', ImageResize)
  Quill.register('modules/imageDrop', ImageDrop)
  import '../css/style.css'
  
  import CryptoJS from 'crypto-js' 
  
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
      this.getNoteList(this.currentPageNo)      
	},
	
	methods: {
      getNoteList (pageNo) {
        localforage.getItem(pageNo).then( value => { 
            if (value === null ) {
              this.items = JSON.parse(JSON.stringify(this.iniItems))
			} else {
              const tempItems =JSON.parse(value)
              if (tempItems.length ===0){
                this.items = JSON.parse(JSON.stringify(this.iniItems))
              }else{
                this.items =tempItems
              }                          
			}
            this.currentPageNo = pageNo			
          }).catch(err => {
            console.log(err)
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
        localforage.setItem(pageNo,JSON.stringify(this.items)).then (() => {
            console.log('save success')
          }).catch (error => {
            console.log(error)
          })
      },

      changePage(pageNo) {                
		this.getNoteList(pageNo) 		        
        for (let i=0;i<this.folderItems.length; i++){          
          if (this.folderItems[i].id == pageNo ){
            this.folderItems[i].sel = true			            
          }else{
            this.folderItems[i].sel = false	 
          }
        }		
      },


      doNothing(){},

      doCopy(i) { 
        const data = new Blob([this.items[i].value],{ type: 'text/html' })
        const item = new ClipboardItem({ 'text/html': data })
        navigator.clipboard.write([item])
      },
      
      setNoteBgColor(item,iColor){
        item.color = iColor
      },

      
      doSaveAsFile(){
        const dataJson =  JSON.stringify(this.items)        
        const sSource = CryptoJS.enc.Utf8.parse(dataJson)
		const sKey = CryptoJS.enc.Utf8.parse('1234567812345678')
        const encryptDataJson = CryptoJS.AES.encrypt( sSource,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString()
        const blobJson = new Blob([encryptDataJson], { type: 'application/json' })	
        const dataURL = URL.createObjectURL(blobJson)		
        const exportFileLink = document.createElement('a')
          exportFileLink.download = this.currentPageNo+'share.123notes'
          exportFileLink.href = dataURL
          document.body.appendChild(exportFileLink)
          exportFileLink.click()
          document.body.removeChild(exportFileLink)
          URL.revokeObjectURL(dataURL)
      },


      doOpenFile(){
        if (!confirm('Open file will Overwrite current Page,Confirm?') ) return
        const that = this
        const inputFile = document.createElement('input')
        inputFile.type = 'file'
        inputFile.accept ='.123notes'
        inputFile.addEventListener('change',function(event){
           const jsonFile =event.target.files[0]
           const reader = new FileReader()		
           reader.onload = function(event){
              const sKey = CryptoJS.enc.Utf8.parse('1234567812345678')
              const dencryptSource =CryptoJS.AES.decrypt(event.target.result,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})  
              const dencryptData=CryptoJS.enc.Utf8.stringify(dencryptSource).toString()
              that.items = JSON.parse(dencryptData)                           
           }
           reader.readAsText(jsonFile)
        })
        inputFile.click()
      },

	},
  }
</script>
 