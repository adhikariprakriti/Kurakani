const socket=io();

socket.on('message',(message)=>{
    console.log(message)
    //Insert html into specified position
    document.querySelector("#messages").insertAdjacentHTML("beforeend",`<div><p>${message.text}</p></div>`)
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    //Insert html into specified position
    document.querySelector("#messages").insertAdjacentHTML("beforeend",`<p><a href="${url.text}" target="_blank">My current location</a></p>`)
})


//seectinh the form and input field
const messageForm=document.querySelector("form")
const messageInput=document.querySelector("input")
const locationButton=document.querySelector("#send-location")
const messageButton=document.querySelector("#send-button")

messageForm.addEventListener('submit',(event)=>{
    //preventing default submission of form
    event.preventDefault();

//disables button afetr msg is sent until receiving acknowledgement
      messageButton.disabled = true;

    const message=event.target.elements.message.value
    
    socket.emit("sendMessage",message,(error)=>{
         //clear input field after sending message
         messageInput.value=" "
         messageInput.focus();
        if(error){
            return console.log(error)
        }

        console.log("Message delievred!")
        //enable button after receiving acknowledgement
        messageButton.disabled = false;

    })
})

//provides location of the client
locationButton.addEventListener('click',()=>{
       
      // check if geolocation is supported/enabled on current browser
     if(!navigator.geolocation){
        return alert('geolocation is not enabled on this browser')
     }

       //disables button afetr location is sent until receiving acknowledgement
        locationButton.disabled = true;



          navigator.geolocation.getCurrentPosition((position)=>{
             const latitude=position.coords.latitude
             const longitude=position.coords.longitude 
             
             socket.emit('sendLocation',{latitude,longitude},()=>{
                 console.log("Location shared!");

            //enable button after receiving acknowledgement
                 locationButton.disabled = false;

             })
     })

});

