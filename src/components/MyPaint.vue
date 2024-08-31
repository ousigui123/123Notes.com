<template>
  <v-container fluid>

    <v-sheet elevation="5" width="100%" height="100%" >
        <v-row  align="center" justify="center">            
            <canvas id="canvasFrame"  :width="canvasWidth" :height="canvasHeight"></canvas>
		</v-row> 
    </v-sheet>
	
    <div>
      <v-card class="py-2 px-1" elevation="2" width="220px"  style="position: absolute; top: -1px; left: -1px;">
        <v-row align="center" justify="start">
          <v-col sm="1">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                 <v-icon  dense  v-bind="attrs"  v-on="on">mdi-menu</v-icon>
              </template>
              <v-list>              
                <v-list-item> <v-icon @click="doNewPage">mdi-file-plus-outline</v-icon> </v-list-item>
                <v-list-item><v-icon @click="doOpenFile">mdi-folder-open-outline</v-icon> </v-list-item>
                <v-list-item><v-icon @click="doSaveAsFile">mdi-floppy</v-icon></v-list-item>
                <v-list-item><v-icon @click="doExportPng">mdi-export</v-icon></v-list-item>			
              </v-list>
            </v-menu> 
          </v-col>
          <v-col  sm="8"> 		
            <v-select dense hide-details rounded  height="20px" :items="pagesList" v-model="pageSel" item-value="pageNo" item-text="pageName" return-object @change="doChangePage"/>
          </v-col>
          <v-col sm="1">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                 <v-icon  small  v-bind="attrs"  v-on="on">mdi-dots-vertical</v-icon>
              </template>
              <v-list>              
                <v-list-item> <v-icon small @click="doRenamePage(pageSel)">mdi-rename-box-outline</v-icon> </v-list-item>
                <v-list-item> <v-icon small @click="doDeletePage(pageSel)">mdi-window-close</v-icon> </v-list-item>                		
              </v-list>
            </v-menu> 
          </v-col>
		</v-row>
      </v-card>
    </div>

    <div>
      <v-card class="py-2 px-1" elevation="2" width="135px" style="position: fixed; top: -3px; right: -2px;"> 
        <v-btn-toggle dense shaped group color="primary" v-model="toggle_exclusive">
          <v-btn x-small width="8"><v-icon @click="doTextBold" small>mdi-format-bold</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="doTextItalic" small>mdi-format-italic</v-icon>	</v-btn>		  
          <v-btn x-small width="8"><v-icon @click="doTextFontSize(-2)" small>mdi-format-annotation-minus</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="doTextFontSize(2)" small>mdi-format-annotation-plus</v-icon></v-btn> 
          <!--<v-btn x-small width="8"><v-avatar  color="red"  size="20" @click="setFontColor('red')"></v-avatar></v-btn>		  -->
          <input type="color" v-model="fontColor" @change="setFontColor(fontColor)"/>				  
		</v-btn-toggle>		
      </v-card>
	</div>

    <div>
      <v-card class="py-2 px-1" elevation="2" width="250px" style="position: fixed; bottom: -3px; left: -2px;"> 
        <v-btn-toggle dense shaped group color="primary" v-model="toggle_exclusive">
          <v-btn x-small width="8"><v-icon @click="setBg" large>mdi-billboard</v-icon></v-btn>		  
          <v-btn x-small width="8"><v-icon @click="zoomOutIn(1)" small>mdi-magnify-plus</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="zoomOutIn(-1)" small>mdi-magnify-minus</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="zoomOutIn(0)" small>mdi-fit-to-page-outline</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="doObjsGroup()" small>mdi-group</v-icon>	</v-btn>
          <v-btn x-small width="8"><v-icon @click="doCopy" small>mdi-content-copy</v-icon>	</v-btn>
          <v-btn x-small width="8"><v-icon @click="doPaste" small>mdi-content-paste</v-icon> </v-btn>		  
          <v-btn x-small width="8"><v-icon @click="handMode(20)" small>mdi-undo</v-icon></v-btn>			
          <v-btn x-small width="8"><v-icon @click="handMode(21)" small>mdi-redo</v-icon></v-btn>          
		</v-btn-toggle>		
      </v-card>
	</div>


    <div>
      <v-card class="py-2 px-1" elevation="15" width="830px" style="position: fixed; bottom: -3px; left: 500px;"> 
        <v-btn-toggle dense shaped group color="primary" v-model="toggle_exclusive">
          <v-btn x-small width="8"><v-icon @click="handMode(0)" dense>mdi-cursor-default-outline</v-icon></v-btn>      		
          <v-btn x-small width="8"><v-icon @click="handMode(19)" dense>mdi-hand-back-right-outline</v-icon></v-btn>   		
          <v-btn x-small width="8"><v-icon @click="setFillFlag" dense>mdi-arrange-send-backward</v-icon></v-btn>
          <v-btn x-small width="8"><v-avatar  color="red"  size="20" @click="setPenColor('red')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="green"  size="20" @click="setPenColor('green')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="yellow"  size="20" @click="setPenColor('yellow')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="#FFFF8D"  size="20" @click="setPenColor('#FFFF8D')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="#B9F6CA"  size="20" @click="setPenColor('#B9F6CA')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="#FFF9C4"  size="20" @click="setPenColor('#FFF9C4')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="#FFCDD2"  size="20" @click="setPenColor('#FFCDD2')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="black"  size="20" @click="setPenColor('black')"></v-avatar></v-btn>
          <v-btn x-small width="8"><v-avatar  color="white"  size="20" @click="setPenColor('white')"></v-avatar></v-btn>
          <input type="color" v-model="penColor" @change="setPenColor(penColor)"/>		
          <v-btn x-small width="8"><v-icon @click="handMode(1)" dense>mdi-pencil</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(15)" dense>mdi-brush</v-icon></v-btn>			  

          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
               <v-icon   dense  v-bind="attrs"  v-on="on">mdi-format-line-weight </v-icon>
            </template>
            <v-list>
              <v-list-item>          
                <v-btn x-small width="8" @click="setPenWidth(1)"><v-avatar color="black" size="3" @click="setPenWidth(1)"></v-avatar> </v-btn>                
                <v-btn x-small width="8" @click="setPenWidth(5)"><v-avatar color="black" size="5" @click="setPenWidth(5)"></v-avatar> </v-btn>
                <v-btn x-small width="8" @click="setPenWidth(10)"><v-avatar color="black" size="10" @click="setPenWidth(10)"></v-avatar> </v-btn>
                <v-btn x-small width="8" @click="setPenWidth(15)"><v-avatar color="black" size="15" @click="setPenWidth(15)"></v-avatar> </v-btn>
                <v-btn x-small width="8" @click="setPenWidth(20)"><v-avatar color="black" size="20" @click="setPenWidth(20)"></v-avatar> </v-btn>
                <v-btn x-small width="8" @click="setPenWidth(25)"><v-avatar color="black" size="25" @click="setPenWidth(25)"></v-avatar> </v-btn>
                <v-btn x-small width="8" @click="setPenWidth(30)"><v-avatar color="black" size="30" @click="setPenWidth(30)"></v-avatar> </v-btn>
              </v-list-item>
              <v-list-item>          
                <input type="number" v-model="penWidth" @change="setPenWidth(penWidth)"/>	
              </v-list-item>
            </v-list>
          </v-menu>
                
          <v-btn x-small width="8"><v-icon @click="penDash" dense>mdi-current-dc</v-icon></v-btn>			
          <v-btn x-small width="8"><v-icon @click="handMode(3)" large>mdi-note-text-outline</v-icon></v-btn>
          <v-btn x-small width="8"><v-icon @click="handMode(4)" dense>mdi-checkbox-blank-outline</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(5)" dense>mdi-checkbox-blank-circle-outline</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(6)" dense>mdi-triangle-outline</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(7)" dense>mdi-cards-diamond-outline</v-icon></v-btn>		
          <v-btn x-small width="8"><v-icon @click="handMode(8)" dense>mdi-minus</v-icon></v-btn>			          		  
          <v-btn x-small width="8"><v-icon @click="handMode(9)" dense>mdi-tilde</v-icon></v-btn>					  
          <v-btn x-small width="8"><v-icon @click="handMode(10)" dense>mdi-arrow-right-thin</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(11)" dense>mdi-arrow-left-thin</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(12)" dense>mdi-arrow-left-right</v-icon></v-btn>	
          <v-btn x-small width="8"><v-icon @click="handMode(13)" dense>mdi-format-color-text</v-icon>	</v-btn>

          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
               <v-icon  dense  v-bind="attrs"  v-on="on">mdi-file-image</v-icon>
            </template>
            <v-list>              
              <v-list-item>          
                <v-file-input id="idImgFile" accept=".jpg,.jpeg,.png,bmp,gif" @change="insertImageFile"/>
              </v-list-item>
            </v-list>
          </v-menu>		

          <v-btn x-small width="8"><v-icon @click="handMode(14)" dense>mdi-spray</v-icon>	</v-btn>                 
          <!--<v-btn x-small width="8"><v-icon @click="doErase" dense>mdi-eraser</v-icon>	</v-btn>-->
          <v-btn x-small width="8"><v-icon @click="doRemove" dense>mdi-delete-circle</v-icon>	</v-btn>		        
        </v-btn-toggle>		
      </v-card>
	</div>   
  </v-container>  
</template>

<script>
  import localforage from 'localforage'
  import  fabric  from 'fabric'
  import CryptoJS from 'crypto-js' 

  
  export default {
    name: 'MyPaint',

    data: () => ({      
      canvasWidth: '1900px',
      canvasHeight: '1000px',	  
      lastX: 0,
      lastY: 0,
      lastPointer: null,
      context: null,  
      scale: 1,
      penColor: '#88ddee',
      fontColor: '#000000',
      penWidth: 1,      
      myCanvas: null,      
      earseFlag: false,

      mouseEventFlag: false,
      drawingObj: null,
      drawType: 0,
      fillFlag: false,
      strokeFlag: true,      
      defaultNoteRect: {        
        angle: 3,
        fill: '#FFF9C4',
        shadow:  'black 3px 5px 3px',
      },
      doActionList:[],   
      toggle_exclusive: 0,
      clipboard2: null,

     pagesList:[{pageNo: 1,pageName: 'Page1'},],
     pageSel:{pageNo: 1,pageName: 'Page1'},  
     bgMode: 0,
    }),
	
    created: function (){
       window.addEventListener('resize', this.getScreenSize)
       this.getScreenSize();
    },
	destroyed: function() {
      window.removeEventListener('resize', this.getScreenSize)
    },
	
	mounted: function () {               
       this.getMyCanvas()
       //this.getCanvasData(this.pageSel) //is included in getPagesList() procedure
       this.getPagesList()
	},
	
	methods: {
       getScreenSize(){
        this.canvasWidth  = window.screen.width
        this.canvasHeight = window.screen.height
       },
	
      getMyCanvas() {
        this.myCanvas = new fabric.Canvas('canvasFrame')
        this.myCanvas.isDrawingMode = false	
        this.myCanvas.on("mouse:down", this.mousedownEvent)
        this.myCanvas.on("mouse:move", this.mousemoveEvent)		
        this.myCanvas.on("mouse:up", this.mouseupEvent)		
        this.myCanvas.on("mouse:out", this.mouseoutEvent)			
        this.myCanvas.setBackgroundImage('bg1.jpg', this.myCanvas.renderAll.bind(this.myCanvas), {left: 100,top: 70,originX: 'left', originY: 'top', scaleX: 1.2*(this.canvasWidth / 1920), scaleY: 1*(this.canvasHeight / 1080),}) 
      },

			
      zoomOutIn(i) {      
        if (i > 0) {        
          this.scale *= 1.1
        } else if (i<0) {        
          this.scale /= 1.1
        } else {
          this.scale = 1
        }
        //this.myCanvas.setZoom(this.scale)
		if(this.lastPointer !== null)this.myCanvas.zoomToPoint(this.lastPointer,this.scale)
      },

      setPenColor(iColor) {
        this.myCanvas.freeDrawingBrush.color = iColor		
		const obj = this.myCanvas.getActiveObject()
		if (obj !== null){ 
          this.setObjColor(obj,iColor)
          if (obj.type == 'group') { this.setObjColor(obj.item(0),iColor)}
		}
        this.myCanvas.requestRenderAll()		
      },
    
      setObjColor(obj,iColor){
        if (this.fillFlag) obj.set({fill: iColor})
        if (this.strokeFlag) obj.set({stroke: iColor})
      },
     
      
      setPenWidth(iPenWidth) {          
        this.myCanvas.freeDrawingBrush.width = Number(iPenWidth)
      }, 

      penDash(){
        if (this.myCanvas.freeDrawingBrush.strokeDashArray == null){
          this.myCanvas.freeDrawingBrush.strokeDashArray = [10,10]      
        } else {
          this.myCanvas.freeDrawingBrush.strokeDashArray = null
        }
      },

      setFillFlag(){
        this.fillFlag = !this.fillFlag
        this.strokeFlag = ! this.strokeFlag
      },

      cleanCanvas() {
        this.myCanvas.clear()	  
      },
	
      doErase () { 
        if ( ! this.earseFlag){	 
          this.handMode(18)		
          this.myCanvas.isDrawingMode = true
          this.myCanvas.freeDrawingBrush.width = 10
          this.myCanvas.freeDrawingBrush.color =  this.$vuetify.theme.dark ?  'rgb(30,30,30)' : 'white'
        }else{
          this.myCanvas.freeDrawingBrush.width = this.penWidth
          this.myCanvas.freeDrawingBrush.color = this.penColor
        }
        this.earseFlag = ! this.earseFlag
      },  

      doRemove() {       		
		this.myCanvas.getActiveObjects().map((obj) => {               
          this.myCanvas.remove(obj)
        })     
        this.myCanvas.renderAll()    		
      },

      doObjsGroup(){
        if (!this.myCanvas.getActiveObject()) {
          return;
        }
        if (this.myCanvas.getActiveObject().type == 'activeSelection') {
          this.myCanvas.getActiveObject().toGroup()
        }else if (this.myCanvas.getActiveObject().type == 'group') {
          this.myCanvas.getActiveObject().toActiveSelection()
        }       		
        this.myCanvas.requestRenderAll()
      },

      doCopy(){
        if (!this.myCanvas.getActiveObject()) {
          return;
        }
        let that=this
        this.myCanvas.getActiveObject().clone((cloned) => {
           that.clipboard2 = cloned
        })
      },

      doPaste(){
        if (!this.clipboard2) {
          return;
        }
        let that=this
        this.clipboard2.clone((clonedObj)=> {
          that.myCanvas.discardActiveObject()
          clonedObj.set({left: clonedObj.left + 10, top: clonedObj.top + 10, evented: true, })
          if (clonedObj.type === 'activeSelection') {			
			clonedObj.canvas = that.myCanvas
			clonedObj.forEachObject(function(obj) {
				that.myCanvas.add(obj)
			})			
			clonedObj.setCoords()
          } else {
			that.myCanvas.add(clonedObj)
          }
          that.clipboard2.top += 10
          that.clipboard2.left += 10
          that.myCanvas.setActiveObject(clonedObj)
          that.myCanvas.requestRenderAll()
        })
      },

      doNothing(){},

 
      getCanvasData (pageObj) {
        localforage.getItem('MyCanvas_'+pageObj.pageNo+'_'+pageObj.pageName).then( value => { 
            if (value !== null ) { 
               this.myCanvas.loadFromJSON(value)             
			}            			
          }).catch(err => {
            console.log(err)
          })		   		  
      },
 
      saveCanvasData(pageObj) {                 
        localforage.setItem('MyCanvas_'+pageObj.pageNo+'_'+pageObj.pageName,JSON.stringify(this.myCanvas.toJSON())).then (() => {
            console.log('save success')          
          }).catch (error => {
            console.log(error)
          })
      },     

      saveCanvasDataAndClean(pageObj) {                 
        const that =this
        localforage.setItem('MyCanvas_'+pageObj.pageNo+'_'+pageObj.pageName,JSON.stringify(this.myCanvas.toJSON())).then (() => {
            that.cleanCanvas()   
            const iPageNo = that.getMaxPageNo() + 1
            that.pagesList.push({pageNo: iPageNo,pageName: 'Page'+iPageNo})
            that.pageSel = that.pagesList[that.pagesList.length-1]            
          }).catch (error => {
            console.log(error)
          })
      }, 

      doNewPage(){        
        this.cleanCanvas()   
        const iPageNo = this.getMaxPageNo() + 1
        this.pagesList.push({pageNo: iPageNo,pageName: 'Page'+iPageNo})
        this.pageSel = this.pagesList[this.pagesList.length-1]        
      },

      doChangePage(){
        this.getCanvasData(this.pageSel)        
      },
      
      doRenamePage(pageObj){
        const newName = prompt('Rename',pageObj.pageName,'')
		if ((newName == null )||(newName == '')) return
        const oldPageName = pageObj.pageName
        pageObj.pageName = newName
		
        localforage.setItem('MyCanvas_'+pageObj.pageNo+'_'+pageObj.pageName,JSON.stringify(this.myCanvas.toJSON())).then (() => {
           localforage.removeItem('MyCanvas_'+pageObj.pageNo+'_'+oldPageName).then (() => { }).catch (error => { console.log(error) })
		}).catch(err =>{
           console.log(err)
		})        		
      },

      doDeletePage(pageObj){
          const that =this
          localforage.removeItem('MyCanvas_'+pageObj.pageNo+'_'+pageObj.pageName).then (() => {
            that.cleanCanvas() 			
            let i = this.pagesList.findIndex(obj => obj === pageObj)
            if (i !== -1) {
             that.pagesList.splice(i, 1)
            } 
            
            if (that.pagesList.length == 0) that.pagesList.push({pageNo: 1,pageName: 'Page1'})
            if((i>0)&&(i>=that.pagesList.length) ) { i-- }            
			that.pageSel = that.pagesList[i]
			
            that.doChangePage()
          }).catch (error => {
            console.log(error)
          }) 
      },

      getPagesList(){  
        const that =this
		let isFirstRun=true
        let pageNo=0
        let pageName=''
		let s=''
        localforage.keys().then(iKeys => {
           iKeys.forEach( (iKey) => {
              if (iKey.substring(0,iKey.indexOf('_')) == 'MyCanvas'){
                if ( isFirstRun ) {
                    that.pagesList = []
                    isFirstRun =false
                }
                s=iKey.substring(iKey.indexOf('_')+1,iKey.length)
                pageNo = s.substring(0,s.indexOf('_'))
				pageName =s.substring(s.indexOf('_')+1,s.length)				
                that.pagesList.push({pageNo: pageNo,pageName: pageName})					
              }
           })
           that.pageSel = that.pagesList[0]
           that.getCanvasData(that.pageSel)           
        }).catch(err => {
           console.log(err);
        })
      },

      getMaxPageNo(){
        let maxPageNo = 0
        this.pagesList.forEach(function(item) {
            if (maxPageNo< Number(item.pageNo)) maxPageNo = Number(item.pageNo)
        })
        return maxPageNo
      },

      mouseoutEvent(){
        this.saveCanvasData(this.pageSel)
      },

      handMode(i){
        switch (i){
          case 0:  //view mode
            this.drawMode(false)
            this.enableSelect(true)	
            this.setDrawType(i)
            break
          case 1:  //free pen mode
          case 14:  //spray		  
          case 15:  //free pen mode  bold brush
            this.drawMode(true)
            this.enableSelect(false)	
            this.setDrawType(i)
            break
          case 3:  // note 
          case 4:  // RECT
          case 5:  //  circle
          case 6:  //  Triangle		  
          case 7:  //  diamond
          case 8:  //  line
          case 9: //curve
          case 10:  // arrow
          case 11: //arrow-left
          case 12:  // arrow-double
          case 13: // text		            
            this.drawMode(false)
            this.enableSelect(false)	
            this.setDrawType(i)
            break          
          case 18: //earse
            this.setDrawType(i)
             break
          case 19: // drag            
            this.drawMode(false)
            this.enableSelect(false)				
            this.setDrawType(i)
            break
          case 20: //undo
            this.unDo()
            break
          case 21: //redo
            this.reDo()
            break
          default:
            break		  
        }
      },

      drawMode(flag){
        this.myCanvas.isDrawingMode = flag     
      },
	
      enableSelect(flag){
        this.myCanvas.selectable = flag
        this.myCanvas.selection = flag
        this.myCanvas.skipTargetFind = !flag		
      },
	
      setDrawType(drawType){        
        this.drawType = drawType
		let brush=null
        switch (drawType){
          case 1:  //pencil
            this.myCanvas.freeDrawingBrush = new fabric.PencilBrush(this.myCanvas)
			break
          case 15:  //pencil -blod brush
            brush= new fabric.PencilBrush(this.myCanvas)
            brush.color =  this.$vuetify.theme.dark ? 'white':'black'
            brush.width = 6
            this.myCanvas.freeDrawingBrush = brush
			break
          case 14: //spray
            this.myCanvas.freeDrawingBrush = new fabric.SprayBrush(this.myCanvas)
            break
          default:
            break
        }
      },
      
      mousedownEvent(e){
        this.mouseEventFlag = true        
		this.lastPointer = this.myCanvas.getPointer(e,false)
        this.drawingObj = null        
      },

      mousemoveEvent(e1){
        if (!this.mouseEventFlag) return
        let e=e1
		e.pointer=this.myCanvas.getPointer(e,false)		
        let newObj = null
        let delta = null
        switch (this.drawType) {
          case 3:    //note
             newObj = this.drawNoteRect(e)
             break
          case 4:  //RECT
             newObj = this.drawRect(e)
             break
          case 5:  //circle
             newObj = this.drawCircle(e)
             break
          case 6:
            newObj = this.drawTriangle(e)
            break 
          case 7: 
            newObj = this.drawDiamond(e)
            break
          case 8: 
            newObj = this.drawLine(e)
            break			
          case 9: 
            newObj = this.drawCurve(e)
            break	
          case 10: 
            newObj = this.drawArrow(e)
            break
          case 11: 
            newObj = this.drawArrowLeft(e)
            break
          case 12: 
            newObj = this.drawArrowDouble(e)
            break
          case 13: //text
            newObj = this.drawText(e)            
            break           
          case 19: //drag
            delta = new fabric.Point(e.e.movementX, e.e.movementY);
            this.myCanvas.relativePan(delta)

			return
          default:
            break
        }
        if (this.drawingObj) this.myCanvas.remove(this.drawingObj)
        if (newObj) {
          this.myCanvas.add(newObj)
          this.drawingObj = newObj          
        }		
      },

      mouseupEvent(){
        this.mouseEventFlag = false	        
        switch (this.drawType) {
          case 1:
          case 8:
          case 9:
          case 10:
          case 12:          
          case 14:          
          case 15:          
            break
          case 13:
            this.handMode(0)
            break
          case 19:
            break
          default:   
            if (this.drawingObj) {
              this.drawingObj.on('mousedblclick', this.shapeMousedbClickEvent)        
              this.myCanvas.setActiveObject(this.drawingObj) 
            }			  
            this.handMode(0)
            break
		}
        this.myCanvas.renderAll()
      },
	
      drawNoteRect(e){
        const rect = new fabric.Rect(this.defaultNoteRect)
        rect.left = this.lastPointer.x
        rect.top = this.lastPointer.y
        rect.width = Math.abs(e.pointer.x - this.lastPointer.x)
        rect.height = Math.abs(e.pointer.y - this.lastPointer.y)	  		        
        return rect        
      },

      drawRect(e){
        return new fabric.Rect({
            left: this.lastPointer.x,
            top: this.lastPointer.y,
            width: Math.abs(e.pointer.x - this.lastPointer.x),
            height: Math.abs(e.pointer.y - this.lastPointer.y),            
            stroke: this.myCanvas.freeDrawingBrush.color,
            strokeWidth: this.myCanvas.freeDrawingBrush.width,
            strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
            fill: 'transparent',	
        })
      },
  
      drawCircle(e) {
        return new fabric.Circle({
            left: this.lastPointer.x,
            top: this.lastPointer.y,
            radius: Math.abs(e.pointer.y - this.lastPointer.y),   
            stroke: this.myCanvas.freeDrawingBrush.color,
            strokeWidth: this.myCanvas.freeDrawingBrush.width,
            strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
            fill: 'transparent',//this.fillColor            
        })		
      },

      drawTriangle(e){ 
        return new fabric.Triangle({
           left: this.lastPointer.x,
           top: this.lastPointer.y,
           width: Math.abs(e.pointer.x - this.lastPointer.x),
           height: Math.abs(e.pointer.y - this.lastPointer.y),
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
           fill: 'transparent', 	           
        })
      },

      drawDiamond(e){
        return new fabric.Polygon([
          { x: this.lastPointer.x, y: this.lastPointer.y }, 
          { x: this.lastPointer.x+Math.abs(e.pointer.x - this.lastPointer.x)/2, y: this.lastPointer.y + Math.abs(e.pointer.y - this.lastPointer.y)/2 },
          { x: this.lastPointer.x,  y: this.lastPointer.y + Math.abs(e.pointer.y - this.lastPointer.y)} ,		  
          { x: this.lastPointer.x-Math.abs(e.pointer.x - this.lastPointer.x)/2, y: this.lastPointer.y+ Math.abs(e.pointer.y - this.lastPointer.y)/2  }
         ], 
          {
           left: this.lastPointer.x,
           top: this.lastPointer.y,           
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,		   
           fill: null,           
        })
      },

      drawText(e){
        return new fabric.IText('Text',{
           left: this.lastPointer.x,
           top: this.lastPointer.y,
           width: Math.abs(e.pointer.x - this.lastPointer.x),
           height: Math.abs(e.pointer.y - this.lastPointer.y),	
           fill: this.fontColor, //this.myCanvas.freeDrawingBrush.color,
           //stroke: this.myCanvas.freeDrawingBrush.color,
           fontSize: 18,
           shadow:  'transparent 0px 1px 0px',		   
		})
      },

      drawLine(e) {
        return new fabric.Line([this.lastPointer.x, this.lastPointer.y, e.pointer.x, e.pointer.y], {            
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray, 
          })	  
      },

      drawCurve(e) {
        let path = ' M ' + this.lastPointer.x + ' ' + this.lastPointer.y            
			path +=' Q '+(this.lastPointer.x )+' '+ (this.lastPointer.y + Math.abs(e.pointer.y - this.lastPointer.y) )+','
			path += (this.lastPointer.x+Math.abs(e.pointer.x - this.lastPointer.x)/2 )+ '  ' + (this.lastPointer.y + Math.abs(e.pointer.y - this.lastPointer.y)/2 )			
			path +=' Q '+( e.pointer.x) +' '+ (e.pointer.y- Math.abs(e.pointer.y - this.lastPointer.y)) + ','
            path += e.pointer.x + '  ' + e.pointer.y
            //path += this.getRightArrowPath(e)			
        return new fabric.Path(path,{
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,	
           fill: 'transparent',
           //fill:this.myCanvas.freeDrawingBrush.color,
		})
      },
      
      getRightArrowPath(e) {
         let theta = 30
         let headlen =10  
         let angle = Math.atan2(this.lastPointer.y - e.pointer.y, this.lastPointer.x - e.pointer.x) * 180 / Math.PI,
         angle1 = (angle + theta) * Math.PI / 180,
         angle2 = (angle - theta) * Math.PI / 180,
         topX = headlen * Math.cos(angle1),
         topY = headlen * Math.sin(angle1),
         botX = headlen * Math.cos(angle2),
         botY = headlen * Math.sin(angle2)
		let arrowX = this.lastPointer.x - topX,
        arrowY = this.lastPointer.y - topY         
        arrowX = e.pointer.x + topX
        arrowY = e.pointer.y + topY
        let path = ' M ' + arrowX + ' ' + arrowY
            path += ' L ' + e.pointer.x + ' ' + e.pointer.y
        arrowX = e.pointer.x + botX
        arrowY = e.pointer.y + botY
           path += ' L ' + arrowX + ' ' + arrowY 
		return path   
      },


      getLeftArrowPath (e) {
         let theta = 30
         let headlen =10  
         let angle = Math.atan2(this.lastPointer.y - e.pointer.y, this.lastPointer.x - e.pointer.x) * 180 / Math.PI,
         angle1 = (angle + theta) * Math.PI / 180,
         angle2 = (angle - theta) * Math.PI / 180,
         topX = headlen * Math.cos(angle1),
         topY = headlen * Math.sin(angle1),
         botX = headlen * Math.cos(angle2),
         botY = headlen * Math.sin(angle2)
        let arrowX = this.lastPointer.x - topX,
        arrowY = this.lastPointer.y - topY         
        arrowX = this.lastPointer.x - topX
        arrowY = this.lastPointer.y - topY
        let path = ' M ' + this.lastPointer.x + ' ' + this.lastPointer.y
            path += ' L ' + arrowX + ' ' + arrowY
        arrowX = this.lastPointer.x - botX
        arrowY = this.lastPointer.y - botY
            path += ' L ' + arrowX + ' ' + arrowY
        return path
       },
          
      drawArrow (e) {         
        let path = ' M ' + this.lastPointer.x + ' ' + this.lastPointer.y
            path += ' L ' + e.pointer.x + ' ' + e.pointer.y 
            path += this.getRightArrowPath(e)
        return new fabric.Path(path,{
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
           fill:this.myCanvas.freeDrawingBrush.color 
		})
      },
 
      drawArrowLeft (e) {         
        let path = this.getLeftArrowPath(e)
            path += ' M ' + this.lastPointer.x + ' ' + this.lastPointer.y
            path += ' L ' + e.pointer.x + ' ' + e.pointer.y
        return new fabric.Path(path,{
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
           fill:this.myCanvas.freeDrawingBrush.color 
		})
      }, 

      drawArrowDouble (e) {         
        let path = this.getLeftArrowPath(e)
           path += ' M ' + this.lastPointer.x + ' ' + this.lastPointer.y
           path += ' L ' + e.pointer.x + ' ' + e.pointer.y		
           path += this.getRightArrowPath(e)
        return new fabric.Path(path,{
           stroke: this.myCanvas.freeDrawingBrush.color,
           strokeWidth: this.myCanvas.freeDrawingBrush.width,
           strokeDashArray: this.myCanvas.freeDrawingBrush.strokeDashArray,
           fill:this.myCanvas.freeDrawingBrush.color 
		})
      },


      insertImageFile(){
        const idImg = document.getElementById('idImgFile')
        const blobFile = idImg.files[0]
        const reader = new FileReader()
		const that = this
        reader.onload = function(event){
            const blobUrl = event.target.result
            fabric.Image.fromURL(blobUrl,(img) => {            
              img.left = 100
              img.top = 100              
              that.myCanvas.add(img)  			
            })
          }
          reader.readAsDataURL(blobFile)
      },

      unDo(){
        if (this.myCanvas._objects.length > 0) {
            this.doActionList.push(this.myCanvas._objects.pop())
            this.myCanvas.renderAll()
        }
      },

      reDo() {
        if (this.doActionList.length > 0) {
            this.myCanvas.add(this.doActionList.pop())
            this.myCanvas.renderAll()
        }
      },
      
       noteGroupMousedbClickEvent(e) {
        if (e.target.type == 'group'){
          const txtObj=e.target.item(1)
          if (txtObj){
            this.myCanvas.setActiveObject(txtObj)
            if( !txtObj.isEditing )txtObj.enterEditing()
            else txtObj.exitEditing()
          }
		}
      },

      shapeMousedbClickEvent(e) {
        const shape = e.target		
        const txt = new fabric.IText('')
        txt.left = shape.getCenterPoint().x-20
		txt.top = shape.getCenterPoint().y-10  
        txt.angle = shape.angle
        txt.fontSize = 16
        txt.fill= this.fontColor //this.myCanvas.freeDrawingBrush.color	
        //txt.stroke=this.myCanvas.freeDrawingBrush.color
        //strokeWidth: this.myCanvas.freeDrawingBrush.width,	
        txt.shadow =  'transparent 0px 1px 0px'
        const noteGroup = new fabric.Group([shape,txt]) 
        noteGroup.on('mousedblclick', this.noteGroupMousedbClickEvent)
        shape.off('mousedblclick')
        this.myCanvas.remove(shape)		
        this.myCanvas.add(noteGroup)
        this.myCanvas.renderAll()

        txt.on('changed',function(){
           txt.left = shape.left+ Math.abs(shape.width - txt.width)/2
           txt.top = shape.top+ Math.abs(shape.height - txt.height)/2          
		})
		
        txt.enterEditing()        
      },


      doTextBold(){
        const obj=this.myCanvas.getActiveObject()
        if (!obj) {
          return;
        }
        
        if (obj.type == 'i-text') {
          this.doTextBoldProc(obj)          
        }else if (obj.type == 'group') {
          if (obj.item(1).type == 'i-text') {
             this.doTextBoldProc(obj.item(1))          	  
          }
        }       		
        this.myCanvas.requestRenderAll()
      },
     
      doTextBoldProc(txtObj){
        if (txtObj.isEditing) {      
             const state = txtObj.getSelectionStyles().find(item => item.fontWeight !== 'bold')
             if (!state || (JSON.stringify(state) === '{}' && txtObj['fontWeight'] === 'bold')) {
               txtObj.setSelectionStyles({ 'fontWeight': 'normal' })
            } else {
              txtObj.setSelectionStyles({ 'fontWeight': 'bold' })
            }			
        }else{			  
            if (txtObj['fontWeight'] === 'bold') {
				txtObj.fontWeight = 'normal'
				let s = txtObj.styles
				for(let i in s) {
                  for (let j in s[i]) {
					s[i][j].fontWeight = 'normal'
                  }
				}
			} else {
				txtObj.fontWeight = 'bold'
				let s = txtObj.styles
				for(let i in s) {
                  for (let j in s[i]) {
					s[i][j].fontWeight = 'bold'
                  }
				}
			}
		}
      },


      doTextItalic(){
        const obj=this.myCanvas.getActiveObject()
        if (!obj) {
          return;
        }
        
        if (obj.type == 'i-text') {
          this.doTextItalicProc(obj)          
        }else if (obj.type == 'group') {
          if (obj.item(1).type == 'i-text') {
             this.doTextItalicProc(obj.item(1))          	  
          }
        }       		
        this.myCanvas.requestRenderAll()
      },
     
      doTextItalicProc(txtObj){
        if (txtObj.isEditing) {      
             const state = txtObj.getSelectionStyles().find(item => item.fontStyle !== 'italic')
             if (!state || (JSON.stringify(state) === '{}' && txtObj['fontStyle'] === 'italic')) {
               txtObj.setSelectionStyles({ 'fontStyle': 'normal' })
            } else {
              txtObj.setSelectionStyles({ 'fontStyle': 'italic' })
            }			
        }else{			  
            if (txtObj['fontStyle'] === 'italic') {
				txtObj.fontStyle = 'normal'
				let s = txtObj.styles
				for(let i in s) {
                  for (let j in s[i]) {
					s[i][j].fontStyle = 'normal'
                  }
				}
			} else {
				txtObj.fontStyle = 'italic'
				let s = txtObj.styles
				for(let i in s) {
                  for (let j in s[i]) {
					s[i][j].fontStyle = 'italic'
                  }
				}
			}
		}
      },
 
      doTextFontSize(iZoom){
        const obj=this.myCanvas.getActiveObject()
        if (!obj) {
          return;
        }
        
        if (obj.type == 'i-text') {
          this.doTextFontSizeProc(obj,iZoom)          
        }else if (obj.type == 'group') {
          if (obj.item(1).type == 'i-text') {
             this.doTextFontSizeProc(obj.item(1),iZoom)          	  
          }
        }       		
        this.myCanvas.requestRenderAll()
      },
     
      doTextFontSizeProc(txtObj,iZoom){
        if (txtObj.isEditing) {                   
            txtObj.setSelectionStyles({ 'fontSize': txtObj.fontSize+ iZoom })
        }else{			              
          txtObj.fontSize +=  iZoom
          let s = txtObj.styles
          for(let i in s) {
              for (let j in s[i]) {
                s[i][j].fontSize +=  iZoom
              }
          }			
		}
      },
 
      setFontColor(iColor){
        const obj=this.myCanvas.getActiveObject()
        if (!obj) {
          return;
        }
        
        if (obj.type == 'i-text') {
          this.doTextFontColorProc(obj,iColor)          
        }else if (obj.type == 'group') {
          if (obj.item(1).type == 'i-text') {
             this.doTextFontColorProc(obj.item(1),iColor)          	  
          }
        }       		
        this.myCanvas.requestRenderAll()
      },

      doTextFontColorProc(txtObj,iColor){                
        txtObj.set({fill: iColor})		
      },
 
      setBg(){
          if(!this.myCanvas.backgroundImage){
            if ((this.bgMode % 2) == 0) { this.myCanvas.setBackgroundImage('bg1.jpg', this.myCanvas.renderAll.bind(this.myCanvas), {left: 100,top: 70,originX: 'left', originY: 'top', scaleX: 1.2*(this.canvasWidth / 1920), scaleY: 1*(this.canvasHeight / 1080),})  }
            else {this.myCanvas.setBackgroundImage('bg2.png', this.myCanvas.renderAll.bind(this.myCanvas), {left: 100,top: 70,originX: 'left', originY: 'top', scaleX: 1.6*(this.canvasWidth / 1920), scaleY: 1.1*(this.canvasHeight / 1080),}) }
            this.bgMode++
          }else{
            this.myCanvas.setBackgroundImage(null, this.myCanvas.renderAll.bind(this.myCanvas))
          }
      },

      doSaveAsFile(){
        const dataJson =  JSON.stringify(this.myCanvas.toJSON())        
        const sSource = CryptoJS.enc.Utf8.parse(dataJson)
		const sKey = CryptoJS.enc.Utf8.parse('**********')  //'*******your key if you want your site and 123notes.com can open same file ,keep the password to 123notes's password,write email ousigui@gmail.com to get  the password*************')
        const encryptDataJson = CryptoJS.AES.encrypt( sSource,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString()
        const blobJson = new Blob([encryptDataJson], { type: 'application/json' })	
        const dataURL = URL.createObjectURL(blobJson)		
        const exportFileLink = document.createElement('a')
          exportFileLink.download = this.pageSel.pageName+'new.123notespen'
          exportFileLink.href = dataURL
          document.body.appendChild(exportFileLink)
          exportFileLink.click()
          document.body.removeChild(exportFileLink)
          URL.revokeObjectURL(dataURL)
      },


      doExportPng(){
          const dataURL = this.myCanvas.toDataURL({
              width: this.myCanvas.width,
              height: this.myCanvas.height,
              left: 0,
              top: 0,
              format: 'png',
           })
          const exportFileLink = document.createElement('a')
          exportFileLink.download = this.pageSel.pageName+'.png'
          exportFileLink.href = dataURL
          document.body.appendChild(exportFileLink)
          exportFileLink.click()
          document.body.removeChild(exportFileLink)
      },

      doOpenFile(){
        const that = this
        const inputFile = document.createElement('input')
        inputFile.type = 'file'
        inputFile.accept ='.123notespen'
        inputFile.addEventListener('change',function(event){
           const jsonFile =event.target.files[0]
           const reader = new FileReader()		
           reader.onload = function(event){
              const sKey = CryptoJS.enc.Utf8.parse('**********')  //'*******your key if you want your site and 123notes.com can open same file ,keep the password to 123notes's password,write email ousigui@gmail.com to get  the password*************')
              const dencryptSource =CryptoJS.AES.decrypt(event.target.result,sKey,{mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})  
              const dencryptData=CryptoJS.enc.Utf8.stringify(dencryptSource).toString()
              const jsonData = JSON.parse(dencryptData)
              if (jsonData !== null ) { 
                 that.doNewPage()
                 that.myCanvas.loadFromJSON(jsonData)
              }
           }
           reader.readAsText(jsonFile)
        })
        inputFile.click()
      },

 
  },
}
</script>

<style>
canvas {
  border: 1px solid #000;
  }



</style>

 
 