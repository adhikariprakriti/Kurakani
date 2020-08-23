const express=require('express')
const path=require('path')
const http=require('http')
const {generateMessage}=require('./src/utils/messages')
const {addUser,getUser,removeUser,getUsersInRoom}=require("./src/utils/users")
const socketio=require('socket.io')
const Filter = require('bad-words')
const queryString = require('query-string');



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

    
  socket.on('join',(searchString,callback)=>{
    const {username,room} = queryString.parse(searchString);
    const {error,user}=addUser({id:socket.id,username,room})
    if(error){
         return callback(error)
    }
    //join individual room and this method can be used only in server
    socket.join(user.room)

    //sends message when the user gets connected
  socket.emit('message',generateMessage("admin","Welcome!!"))

  //sends message to other users of specific room when the new user joins to that room
  socket.broadcast.to(user.room).emit('message',generateMessage("admin",`${user.username} has joined`))
   
//display the active users on sidebar
  io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})

  callback()
  })


  socket.on('sendMessage',(message,callback)=>{ 

    const user=getUser(socket.id)
    const filter = new Filter();
     if(filter.isProfane(message)){
       return callback("profanity is not allowed")
     }

    io.to(user.room).emit('message',generateMessage(user.username,message))
    //for the acknowledgement of event
    callback();
  })

  socket.on('sendLocation',({latitude,longitude},callback)=>{
    const user=getUser(socket.id)

      io.to(user.room).emit('locationMessage',generateMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
       
      //for the acknowledgement that the location has been shared
        callback()
  })

  //runs when the user gets disconnected
  socket.on('disconnect',()=>{
   const user=removeUser(socket.id)
  // const{id,room,username}= (...user)
  // console.log(...user)
   if(user){
    io.to(user[0].room).emit('message',generateMessage("admin",`${user[0].username} has Left`))
    
    //to display the active users on siderbar
    io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})

  }
  })
  });
  


server.listen(port,()=>{
    console.log(`server is on ${port}`)
}) 