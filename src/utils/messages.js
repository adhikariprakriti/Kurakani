var moment = require('moment'); 

generateMessage=(username,text)=>{ 
 return  {
      username, 
       text,
      createdAt:moment(new Date().getTime()).format('h:mm a')
   }
}

module.exports={
    generateMessage
}