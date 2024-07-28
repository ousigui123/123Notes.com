<template>
  <v-container>
    <!--<v-row>
      <v-col v-for="(item,i) in items" :key="i">
        <v-card elevation="15" :color="item.color" width="300px" height="350px">                    
          <quill-editor ref="myQuillEditor" v-model="item.value" :options="editorOption" height="450px" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" />
        </v-card>
      </v-col>
    </v-row>-->
	
	<draggable v-model="items" class="drag-container">	
      <div v-for="item in items" :key="item.id" class="drag-item">
        <v-card elevation="15" :color="item.color" width="300px" height="400px">
          <!--<v-card-title>
            <v-icon>{{item.icon}}</v-icon><v-icon @click="delNote(i)">mdi-close</v-icon>
          </v-card-title>-->
          <!--<v-textarea :background-color="item.color" color="black" solo v-model="item.value" @change="saveNote"></v-textarea>-->
          <quill-editor ref="myQuillEditor" v-model="item.value" :options="editorOption" height="450px" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" />
        </v-card>
      </div>	
  </draggable>
	
	<div>
      <v-card class="py-2 px-4" color="rgba(0, 0, 0, .3)" min-width="100" style="position: fixed; bottom: 20px; right: -25px; bottom-radius: 8px; z-index: 1;">
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
  import {quillEditor} from 'vue-quill-editor'
  
  import draggable from 'vuedraggable'
  
  
  export default {
    name: 'HelloWorld',
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
           ['bold','strike'],
           [{list: 'ordered'},{list: 'bullet'}],
           //[{color:[]},{background:[]}],
           ['image'],
         ],
        },
      },
    }),
	
	mounted: function () {
      this.getNoteList()
      this.editor()
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
        return this.$refs.myQuillEditor.quill
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
	},
  }
</script>
 
<style>
.ql-editor {
 
}
.ql-container {
      line-height: normal !important;
      height: 350px;
    }
	
.drag-container {
  display: flex; flex-wrap: wrap;
}
.drag-item {
  cursor: move;
  margin: 25px;
}	
</style>