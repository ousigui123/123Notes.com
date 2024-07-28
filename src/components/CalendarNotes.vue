<template>
  <v-container fluid>

    <v-sheet color="primary" elevation="5" width="100%" height="60px" >
        <v-row  align="center" justify="center">
            <v-card-title>{{currentYear}}-{{currentMonth}}</v-card-title>
		</v-row> 
    </v-sheet>
	
    <v-calendar :value="today" :now="today" type="month" :weekdays="weekdays" color="primary" @click:date="addCalendarNote">
       <template v-slot:day="{ weekday, present,day,month}">
          <v-row align="center" justify="center" v-if="present ||( (month == currentMonth) && (calendarItems[day-1].value !== ''))">               
               <v-sheet :color="iniWeekdaysItems[weekday].titleColor" elevation="10" width="80%" height="22px" light>
                    <v-row  align="center" justify="end">
                      <v-card-title><v-icon small @click="doNothing()">mdi-content-save</v-icon><v-icon x-small>mdi-share-variant</v-icon><v-icon x-small>mdi-pin</v-icon><v-icon small @click="delCalendarNote(day-1)">mdi-delete</v-icon></v-card-title>
					</v-row>
               </v-sheet>
               <v-sheet :color="iniWeekdaysItems[weekday].color" elevation="5" width="80%" height="320px" light>
                 <v-textarea :background-color="iniWeekdaysItems[weekday].color" solo v-model="calendarItems[day-1].value" @blur="saveCalendarNote()" width="100%" height="320px"></v-textarea>
               </v-sheet>
               <v-sheet color="grey"  width="80%" height="15px" light> </v-sheet>               
          </v-row>  
       </template>
    </v-calendar>   	
           
  </v-container>  
</template>

<script>
  import localforage from 'localforage'

  
  export default {
    name: 'CalendarNotes',

    data: () => ({
       weekdays: [1,2,3,4,5],
       
       iniWeekdaysItems: [
        {
           id: 1,
           icon: 'mdi-pin',
           titleColor: 'primary',
           color: '#FFFF8D',
           value: '',
        },
		{
           id: 2,
           icon: 'mdi-balloon',
           titleColor: 'success',
           color: '#FFF9C4',
           value: '',
        },
		{
           id: 3,
           icon: 'mdi-map-marker',
           titleColor: 'warning',
           color: '#B9F6CA',
           value: '',
        },
		{
           id: 4,
           icon: 'mdi-pin',
           titleColor: 'error',
           color: '#FFCDD2',
           value: '',
        },
		{
           id: 5,
           icon: 'mdi-balloon',
           titleColor: 'primary',
           color: '#FFFF8D',
           value: '',
        },
		{
           id: 6,
           icon: 'mdi-pin',
           titleColor: 'success',
           color: '#FFF9C4',
           value: '',
        },
        {
           id: 7,
           icon: 'mdi-pin',
           titleColor: 'warning',
           color: '#B9F6CA',
           value: '',
        },
      ],
   
      currentYear: '2024',
      currentMonth: '10',
     
 
      calendarItems: [
       {day: 1, value: '',},{day: 2, value: '',},{day: 3, value: '',},{day: 4, value: '',},{day: 5, value: '',},{day: 6, value: '',},{day: 7, value: '',},{day: 8, value: '',},{day: 9, value: '',},{day: 10, value: '',},
       {day: 11, value: '',},{day: 12, value: '',},{day: 13, value: '',},{day: 14, value: '',},{day: 15, value: '',},{day: 16, value: '',},{day: 17, value: '',},{day: 18, value: '',},{day: 19, value: '',},{day: 20, value: '',},
       {day: 21, value: '',},{day: 22, value: '',},{day: 23, value: '',},{day: 24, value: '',},{day: 25, value: '',},{day: 26, value: '',},{day: 27, value: '',},{day: 28, value: '',},{day: 29, value: '',},{day: 30, value: '',},{day: 31, value: '',},
      ],
 
    }),
	
	mounted: function () {            
      this.getCurrentDate()
      this.getCalendarNoteList(this.currentYear,this.currentMonth)      
	},
	
	methods: {
      getCalendarNoteList (iYear,iMonth) {
        const sYYYYMM = iYear + '-' + iMonth
        localforage.getItem(sYYYYMM).then( value => { 
            if (value !== null ) {              
              const tempItems =JSON.parse(value)
              this.calendarItems =tempItems              
			}            
          }).catch(err => {
            console.log(err)
          })		   		  
      },

      addCalendarNote ({day,date,month}) {
        if (month !== this.currentMonth) { return }	  
        if (this.calendarItems[day-1].value == '') {
          this.calendarItems[day-1].value = date
		}
      },

      delCalendarNote (i) {
        this.calendarItems[i].value = ''
		this.saveCalendarNote()
      },

      saveCalendarNote () {
        const sYYYYMM = this.currentYear + '-' + this.currentMonth
        localforage.setItem(sYYYYMM,JSON.stringify(this.calendarItems)).then (() => {
            console.log('save success')
          }).catch (error => {
            console.log(error)
          })
      },

     

      doNothing(){},
 
      getCurrentDate() {
        const now = new Date()
        this.currentYear = now.getFullYear()
        this.currentMonth = now.getMonth() + 1       		
      },

       
	},
  }
</script>

 
 