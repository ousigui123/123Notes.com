cardHeight <template>
  <v-container fluid>
  
	<div class="folder-div">      
      <div  v-for="(item) in folderItems" :key="item">       
        <v-card class="py-1 px-0" :class="[item.sel?'folder-item-sel':'folder-item']" elevation="15" :color="item.color" @click="changePage(item.id)">
        <v-card-text>{{item.id}}</v-card-text>
       </v-card>     
      </div>
    </div>
  
	
    <div v-if="viewMode == false ">
        <v-card elevation="15" color="#FFF9C4" height="90vh"  width="90%" style="position: relative; top: 5px; left: 60px;" light>           
          <div class="main-container">
              <div class="editor-container editor-container_document-editor editor-container_include-minimap editor-container_include-style" ref="editorContainerElement">				
				<div class="editor-container__toolbar" ref="editorToolbarElement"></div>
				<div class="editor-container__minimap-wrapper">
					<div class="editor-container__editor-wrapper">
						<div class="editor-container__editor">
							<div ref="editorElement">
								<ckeditor :editor="editor" v-model="editorData" :config="editorConfig"  @ready="onReady"  @blur="saveWordData(currentPageNo)"></ckeditor> 
							</div>
						</div>
					</div>					
				</div>
              </div>
          </div>		  
        </v-card>
    </div>	  
    <div v-else>
      <v-card class="py-2 px-2" elevation="2" width="90%" style="position: relative; top: 5px; left: 60px;">          
         <v-card-title>
           Page {{currentPageNo}}
         </v-card-title>		 
         <div v-html="editorData"></div>
      </v-card>
    </div>  
	
    <div>
      <v-card class="py-2 px-1" elevation="2" width="30px" style="position: fixed; top: -3px; right: -2px;"> 
          <v-icon dense @click="doNewFile">mdi-file-outline</v-icon>
          <v-icon dense @click="doOpenFile">mdi-folder-open-outline</v-icon>
          <v-icon dense @click="doSaveAsFile">mdi-share</v-icon>
          <v-icon dense @click="swiftPageViewMode">mdi-book-open-variant-outline</v-icon>
      </v-card>
	</div>
  </v-container>  
</template>

<script>
  import localforage from 'localforage'   
  import '../css/style.css'  
  import '../css/ck5-style.css'  
  import CryptoJS from 'crypto-js' 
  
  //import 'ckeditor5/ckeditor5.css'
  import CKEditor from '@ckeditor/ckeditor5-vue2'  
  import {DecoupledEditor,AccessibilityHelp,Alignment,Autoformat,AutoImage,AutoLink,Autosave,BalloonToolbar,Base64UploadAdapter,BlockQuote,BlockToolbar,Bold,Code,CodeBlock,Essentials,FindAndReplace,FontBackgroundColor,FontColor,FontFamily,FontSize,FullPage,GeneralHtmlSupport,
	Heading,Highlight,HorizontalLine,HtmlComment,HtmlEmbed,ImageBlock,ImageCaption,ImageInline,	ImageInsert,ImageInsertViaUrl,ImageResize,ImageStyle,ImageTextAlternative,ImageToolbar,ImageUpload,Indent,IndentBlock,Italic,Link,LinkImage,List,ListProperties,Markdown,MediaEmbed,
	Mention,PageBreak,Paragraph,PasteFromMarkdownExperimental,PasteFromOffice,RemoveFormat,SelectAll,ShowBlocks,SourceEditing,SpecialCharacters,SpecialCharactersArrows,SpecialCharactersCurrency,SpecialCharactersEssentials,SpecialCharactersLatin,SpecialCharactersMathematical,
	SpecialCharactersText,Strikethrough,Style,Subscript,Superscript,Table,TableCaption,TableCellProperties,TableColumnResize,TableProperties,TableToolbar,TextPartLanguage,TextTransformation,Title,TodoList,Underline,Undo} from 'ckeditor5'
  
  
  export default {
    name: 'MyWord',
    components: {
      ckeditor: CKEditor.component,
    },
    data: () => ({                
        viewMode: false,
        editor: DecoupledEditor, 
        editorData: '',
        editorConfig: {
                toolbar: {
                  items: ['undo','redo','|','sourceEditing','showBlocks','findAndReplace','selectAll','textPartLanguage',	'|','heading','style','|','fontSize','fontFamily','fontColor','fontBackgroundColor','|','bold','italic','underline','strikethrough','subscript','superscript','code','removeFormat',
                        '|','specialCharacters','horizontalLine','pageBreak','link','insertImage','insertImageViaUrl','mediaEmbed','insertTable','highlight','blockQuote','codeBlock','htmlEmbed','|','alignment','|','bulletedList','numberedList','todoList','outdent','indent','|','accessibilityHelp' ],
                  shouldNotGroupWhenFull: false,						
                },
                plugins: [ AccessibilityHelp,Alignment,Autoformat,AutoImage,AutoLink,Autosave,BalloonToolbar,Base64UploadAdapter,BlockQuote,BlockToolbar,Bold,Code,CodeBlock,Essentials,FindAndReplace,FontBackgroundColor,FontColor,FontFamily,FontSize,FullPage,GeneralHtmlSupport,Heading,
                   Highlight,HorizontalLine,HtmlComment,HtmlEmbed,ImageBlock,ImageCaption,ImageInline,ImageInsert,ImageInsertViaUrl,ImageResize,ImageStyle,ImageTextAlternative,ImageToolbar,ImageUpload,Indent,IndentBlock,Italic,Link,LinkImage,List,ListProperties,Markdown,MediaEmbed,Mention,
                   PageBreak,Paragraph,PasteFromMarkdownExperimental,PasteFromOffice,RemoveFormat,SelectAll,ShowBlocks,SourceEditing,SpecialCharacters,SpecialCharactersArrows,SpecialCharactersCurrency,SpecialCharactersEssentials,SpecialCharactersLatin,SpecialCharactersMathematical,
                   SpecialCharactersText,Strikethrough,Style,Subscript,Superscript,Table,TableCaption,TableCellProperties,TableColumnResize,TableProperties,TableToolbar,TextPartLanguage,TextTransformation,Title,TodoList,Underline,Undo ],
                balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
                blockToolbar: ['fontSize','fontColor','fontBackgroundColor','|','bold','italic','|','link','insertImage','insertTable','|','bulletedList','numberedList','outdent','indent'],
                fontFamily: { supportAllValues: true },
                fontSize: {options: [10, 12, 14, 'default', 18, 20, 22],supportAllValues: true},
                heading: {
                    options: [
                      {model: 'paragraph',title: 'Paragraph',class: 'ck-heading_paragraph'},
                      {model: 'heading1',view: 'h1',title: 'Heading 1',class: 'ck-heading_heading1'},
                      {model: 'heading2',view: 'h2',title: 'Heading 2',class: 'ck-heading_heading2'},
                      {model: 'heading3',view: 'h3',title: 'Heading 3',class: 'ck-heading_heading3'},
                      {model: 'heading4',view: 'h4',title: 'Heading 4',class: 'ck-heading_heading4'},
                      {model: 'heading5',view: 'h5',title: 'Heading 5',class: 'ck-heading_heading5'},
                      {model: 'heading6',view: 'h6',title: 'Heading 6',class: 'ck-heading_heading6'}
                    ]
                },
                htmlSupport: {allow: [{name: /^.*$/, styles: true,attributes: true,classes: true},]},
                image: {toolbar: ['toggleImageCaption','imageTextAlternative','|','imageStyle:inline','imageStyle:wrapText','imageStyle:breakText','|','resizeImage']},
                link: {addTargetToExternalLinks: true,defaultProtocol: 'https://', decorators: {toggleDownloadable: {mode: 'manual',label: 'Downloadable',attributes: {download: 'file'}}}},
                list: {properties: {styles: true,startIndex: true,reversed: true}},
                mention: {feeds: [{marker: '@',feed: []}]},
                menuBar: {isVisible: false},                
                placeholder: 'Type or paste content here!',
                style: {
                    definitions: [
                       {name: 'Article category',element: 'h3',classes: ['category']},
                       {name: 'Title',element: 'h2',classes: ['document-title']},
                       {name: 'Subtitle',element: 'h3',classes: ['document-subtitle']},
                       {name: 'Info box',element: 'p',	classes: ['info-box']},
                       {name: 'Side quote',element: 'blockquote',classes: ['side-quote']},
                       {name: 'Marker',element: 'span',classes: ['marker']},
                       {name: 'Spoiler',element: 'span',classes: ['spoiler']},
                       {name: 'Code (dark)',element: 'pre',classes: ['fancy-code', 'fancy-code-dark']},
                       {name: 'Code (bright)',element: 'pre',classes: ['fancy-code', 'fancy-code-bright']}
                    ]
                },
                table: {contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']},
        },
   
        currentPageNo: '1',              

        folderItems: [
           {id:'1',color:'#dddddd',sel:true,},{id:'2',color:'#aadddd',sel:false,},{id:'3',color:'#dddddd',sel:false,},{id:'4',color:'#eecc00',sel:false,},{id:'5',color:'#dddddd',sel:false,},{id:'6',color:'#dddddd',sel:false,},{id:'7',color:'#ddaaaa',sel:false,},{id:'8',color:'#dddddd',sel:false,},{id:'9',color:'#dddddd',sel:false,},{id:'A',color:'#888888',sel:false,},{id:'B',color:'#8888aa',sel:false,},{id:'C',color:'#66dddd',sel:false,},{id:'D',color:'#dddddd',sel:false,},{id:'E',color:'#dddddd',sel:false,},{id:'F',color:'#dddddd',sel:false,},{id:'G',color:'#dddddd',sel:false,},{id:'H',color:'#11dd55',sel:false,},{id:'I',color:'#dddddd',sel:false,},{id:'J',color:'#dddddd',sel:false,},{id:'K',color:'#9900dd',sel:false,},
        ],             
 
    }),
	
	mounted: function () {      
      this.getWordData(this.currentPageNo)      
	},
	
	methods: {
      getWordData (pageNo) {
        localforage.getItem('Word_'+pageNo).then( value => {
            if(value == null){
              this.editorData = ''
            }else{
              this.editorData = value
            }
            this.currentPageNo = pageNo	            
          }).catch(err => {
            console.log(err)
          })		   		  
      },
    

      saveWordData (pageNo) {
        localforage.setItem('Word_'+pageNo,this.editorData).then (() => {
            console.log('save success')
          }).catch (error => {
            console.log(error)
          })
      },

      changePage(pageNo) {                
		this.getWordData(pageNo) 		        
        for (let i=0;i<this.folderItems.length; i++){          
          if (this.folderItems[i].id == pageNo ){
            this.folderItems[i].sel = true			            
          }else{
            this.folderItems[i].sel = false	 
          }
        }		
      },

      doNothing(){},
      
      swiftPageViewMode(){
         this.viewMode = ! this.viewMode         
      },      
      
      doSaveAsFile(){
        const dataJson =  this.editorData
        const sSource = CryptoJS.enc.Utf8.parse(dataJson)
		const sKey = CryptoJS.enc.Utf8.parse('1234567812345678')
        const encryptDataJson = CryptoJS.AES.encrypt( sSource,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString()
        const blobJson = new Blob([encryptDataJson], { type: 'application/json' })	
        const dataURL = URL.createObjectURL(blobJson)		
        const exportFileLink = document.createElement('a')
          exportFileLink.download = this.currentPageNo+'share.123notes_word'
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
        inputFile.accept ='.123notes_word'
        inputFile.addEventListener('change',function(event){
           const jsonFile =event.target.files[0]
           const reader = new FileReader()		
           reader.onload = function(event){
              const sKey = CryptoJS.enc.Utf8.parse('1234567812345678')
              const dencryptSource =CryptoJS.AES.decrypt(event.target.result,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})  
              const dencryptData=CryptoJS.enc.Utf8.stringify(dencryptSource).toString()
              that.editorData = dencryptData
           }
           reader.readAsText(jsonFile)
        })
        inputFile.click()
      },

      doNewFile(){
        if (!confirm('Clear current Page content,Confirm?') ) return
        this.editorData = ''
      },

      onReady(editor) {
			Array.from(this.$refs.editorToolbarElement.children).forEach(child => child.remove())			
			this.$refs.editorToolbarElement.appendChild(editor.ui.view.toolbar.element)			
      },

	},
  }
</script>
 