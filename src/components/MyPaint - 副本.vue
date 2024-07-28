<template>
  <v-container fluid>

    <v-sheet elevation="5" width="100%" height="100%" >
        <v-row  align="center" justify="center">            
            <canvas ref="canvasFrame" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" width="1900px" height="1000px"></canvas>
			<canvas ref="canvasFrameBak" v-show="false" width="1900px" height="1000px"></canvas>
		</v-row> 
    </v-sheet>
	
 

    <div>
      <v-card class="py-2 px-1" elevation="15"  width="30px" style="position: absolute; top: -10px; left: -2px;">        
        <v-icon @click="cleanCanvas">mdi-file-plus-outline</v-icon>
		<v-icon @click="saveCanvas">mdi-content-save</v-icon>
        <v-icon @click="cleanCanvas">mdi-export</v-icon>
      </v-card>
	</div>
	
    <div>
      <v-card class="py-2 px-1" elevation="15" width="750px" style="position: absolute; top: -5px; left: 500px;"> 
        <v-icon @click="handView(1)">mdi-cursor-default-outline</v-icon>      		
        <v-avatar  color="primary"  size="20"></v-avatar>
        <v-avatar  color="warning"  size="20"></v-avatar>
        <v-avatar  color="success"  size="20"></v-avatar>
        <v-avatar  color="black"  size="20"></v-avatar>
        <v-avatar  color="error"  size="20"></v-avatar>		
        <input type="color" v-model="penColor" @change="setPenColor"/>

        <input type="number" v-model="penWidth" @change="setPenWidth">		
        <v-icon @click="handView(0)">mdi-pencil</v-icon>		
        <v-icon @click="handView(0)">mdi-format-line-weight</v-icon>				
		<v-icon @click="handView(0)">mdi-drag-horizontal</v-icon>	
		<v-icon @click="handView(0)">mdi-checkbox-blank-outline</v-icon>	
		<v-icon @click="handView(0)">mdi-checkbox-blank-circle-outline</v-icon>	
		<v-icon @click="handView(0)">mdi-triangle-outline</v-icon>	
        <v-icon @click="handView(0)">mdi-cards-diamond-outline</v-icon>		
        <v-icon @click="handView(0)">mdi-arrow-right-thin</v-icon>	
        <v-icon @click="handView(0)">mdi-arrow-left-thin</v-icon>	
        <v-icon @click="handView(0)">mdi-arrow-left-right</v-icon>	
        <v-icon @click="handView(0)">mdi-format-color-text</v-icon>	
        <v-icon @click="handView(1)" dense>mdi-hand-back-right-outline</v-icon>      
        <v-icon @click="zoomOutIn(1)">mdi-magnify-plus</v-icon>
        <v-icon @click="zoomOutIn(-1)">mdi-magnify-minus</v-icon>
        <v-icon @click="zoomOutIn(0)">mdi-magnify-scan</v-icon>	
        <v-icon @click="zoomOutIn(0)">mdi-eraser</v-icon>			
        <v-icon @click="cleanCanvas">mdi-delete-circle</v-icon>		       
      </v-card>
	</div>
	
    
   
 
  </v-container>  
</template>

<script>
  import localforage from 'localforage'

  
  export default {
    name: 'MyPaint',

    data: () => ({
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      context: null,  
      scale: 1,
      penColor: '#88ddee',
      penWidth: 1,
      handViewMode: 0,
    }),
	
	mounted: function () {            
       this.getCanvas()
	},
	
	methods: {
      startDrawing(e) {
        if (this.handViewMode>0) return
        const canvas = this.$refs.canvasFrame
        this.context = canvas.getContext('2d')
        this.context.beginPath()
        this.isDrawing = true 
        const rect = canvas.getBoundingClientRect()
        this.lastX = e.clientX - rect.left
        this.lastY = e.clientY - rect.top
        this.context.moveTo(this.lastX, this.lastY)
    },
	
    draw(e) {
      if (this.handViewMode>0) return
      if (!this.isDrawing) return
      const canvas = this.$refs.canvasFrame
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top 
      this.context.lineTo(x, y)
      this.context.stroke() 
      this.lastX = x
      this.lastY = y
    },
    
	handView(i){
      this.handViewMode = i
	},
	
	
	
    zoomOutIn(i) {      
      if (i > 0) {        
          this.scale *= 1.1
      } else if (i<0) {        
          this.scale /= 1.1
      } else {
          this.scale = 1
      }


      const canvas = this.$refs.canvasFrame
      const mCtx  = canvas.getContext('2d')

      const canvasBak = this.$refs.canvasFrameBak
      const mCtxBak  = canvasBak.getContext('2d')
      mCtxBak.clearRect(0,0,canvasBak.width,canvasBak.height)
      mCtxBak.drawImage(canvas,0,0)

      mCtx.clearRect(0,0,canvas.width,canvas.height)
      //mCtx.translate()
      mCtx.scale(this.scale,this.scale)
      mCtx.drawImage(canvasBak,0,0,canvas.width,canvas.height,100,100,canvas.width*this.scale,canvas.height*this.scale)
    },

    stopDrawing() {
      this.isDrawing = false;
    },  

    setPenColor() {
      const mCtx = this.$refs.canvasFrame.getContext('2d')
      mCtx.strokeStyle = this.penColor
    }, 

    setPenWidth() {
      const mCtx = this.$refs.canvasFrame.getContext('2d')
      mCtx.lineWidth = this.penWidth
    }, 

    cleanCanvas() {
      const canvas = this.$refs.canvasFrame		
      const mCtx = canvas.getContext('2d')
      mCtx.clearRect(0,0,canvas.width,canvas.height)	  
    },

    doNothing(){},
 
    getCanvas () {
        localforage.getItem('canvas').then( value => { 
            if (value !== null ) { 
               const canvas = this.$refs.canvasFrame
               const mCtx = canvas.getContext('2d')
               this.blobToCanvas(value,canvas,mCtx)                
			}            			
          }).catch(err => {
            console.log(err)
          })		   		  
    },
 
    saveCanvas() { 
        const canvas = this.$refs.canvasFrame
        canvas.toBlob(value =>{
          localforage.setItem('canvas',value).then (() => {
            console.log('save success')          
          }).catch (error => {
            console.log(error)
          })
		})
	}, 

    blobToCanvas(blob,canvas,ctx) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function(event) {
          const dataURL = event.target.result
          const img = new Image()
          img.onload = function() {             
             ctx.drawImage(img, 0, 0)
             resolve(canvas)
          }
          img.src = dataURL
        }
        reader.readAsDataURL(blob)
     })
   },

       
  },
}
</script>

<style>
canvas {
  border: 1px solid #000;
}


</style>

 
 