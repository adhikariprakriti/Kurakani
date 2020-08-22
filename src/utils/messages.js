var moment = require('moment'); 

generateMessage=(text)=>{ 
 return  { 
       text,
      createdAt:moment(new Date().getTime()).format('h:mm a')
   }
}

module.exports={
    generateMessage
}