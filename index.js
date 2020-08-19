const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')


const app=express()
//create new web server
const server=http.createServer(app)
//initialize a new instance of socket.io by passing the (the HTTP server) object
const io=socketio(server)


const port=process.env.PORT||8000
const publicDirectoryPath=path.join(__dirname,'/public')

//setup static directory to serve
app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('new web socket connection');

    //sends message when the user gets connected
  socket.emit('welcomeMessage',"hello user!!")

  //sends message to other users when the new user joins
  socket.broadcast.emit('message',"A new user has joined")

  socket.on('sendMessage',(message,callback)=>{
    io.emit('message',message)
    //for the acknowledgement of event
    callback("hahahhahahahah")
  })

  socket.on('sendLocation',({latitude,longitude})=>{
      io.emit('message',`https://google.com/maps?q=${latitude},${longitude}`)
  })

  //runs when the user gets disconnected
  socket.on('disconnect',()=>{
    io.emit('message',"A user has Left")
  })
  });
  


server.listen(port,()=>{
    console.log(`server is on ${port}`)
}) 