const socket=io();

 socket.on('welcomeMessage',(message)=>{
    console.log(message)
})

socket.on('message',(message)=>{
    console.log(message)
})


//seectinh the form and input field
const messageForm=document.querySelector("form")
const messageInput=document.querySelector("input")
const locationButton=document.querySelector("#send-location")

messageForm.addEventListener('submit',(event)=>{
    //preventing default submission of form
    event.preventDefault();
    const message=event.target.elements.message.value
    socket.emit("sendMessage",message,(message)=>{
        console.log("message was successfully delivered",message)
    })
})

//provides location of the client
locationButton.addEventListener('click',()=>{

      // check if geolocation is supported/enabled on current browser
     if(!navigator.geolocation){
        return alert('geolocation is not enabled on this browser')
     }

     navigator.geolocation.getCurrentPosition((position)=>{
             const latitude=position.coords.latitude
             const longitude=position.coords.longitude 
             socket.emit('sendLocation',{latitude,longitude})
     })

});

