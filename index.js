const express=require('express')
const path=require('path')
const http=require('http')
const {generateMessage}=require('./src/utils/messages')
const socketio=require('socket.io')
const Filter = require('bad-words'),


 app=express()
//create new web server
const server=http.createServer(app)
//initialize a new instance of socket.io by passing the (the HTTP server) object
const io=socketio(server)


const port=process.env.PORT||8000
const publicDirectoryPath=path.join(__dirname,'/public')
const viewsPath=path.join(__dirname,'/public/views')

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

// app.get('/',(req,res)=>{
//   res.render('index')   
// })



io.on('connection', (socket) => {
    console.log('new web socket connection');

    //sends message when the user gets connected
  socket.emit('message',generateMessage("hello user!!"))

  //sends message to other users when the new user joins
  socket.broadcast.emit('message',generateMessage("A new user has joined"))

  socket.on('sendMessage',(message,callback)=>{ 
    const filter = new Filter();

     if(filter.isProfane(message)){
       return callback("profanity is not allowed")
     }

    io.emit('message',generateMessage(message))
    //for the acknowledgement of event
    callback();
  })

  socket.on('sendLocation',({latitude,longitude},callback)=>{
      io.emit('locationMessage',generateMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        //for the acknowledgement that the location has been shared
        callback()
  })

  //runs when the user gets disconnected
  socket.on('disconnect',()=>{
    io.emit('message',generateMessage("A user has Left"))
  })
  });
  


server.listen(port,()=>{
    console.log(`server is on ${port}`)
}) 