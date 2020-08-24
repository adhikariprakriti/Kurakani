const socket=io();
const queryParamsString = window.location.search.substr(1).replace(/&/g,' ').replace(/=/g,'').replace(/username/g,'').replace(/room/g,'');
const[name,room]=queryParamsString.split(' ');



socket.on('message',(message)=>{
    console.log(message)
   

    //Insert html into specified position

    if(message.username===name.toLowerCase()){
     // console.log("i sent message........")
      document.querySelector("#messages").insertAdjacentHTML("beforeend",
      `<li class="message">
      <div class="message__title__sent">
          <h4>${message.username}</h4>
          <span>${message.createdAt}</span>
      </div>
      <div class="message__body__sent">
         <p>${message.text}</p>
      </div>
      </li>`)
  
  
    }else{
    // console.log("fdfvfvfv")
     document.querySelector("#messages").insertAdjacentHTML("beforeend",
     `<div class="message__list">
     <li class="message">
     <div class="message__title">
         <h4>${message.username}</h4>
         <span>${message.createdAt}</span>
     </div>
     <div class="message__body">
        <p>${message.text}</p>
     </div>
     </li>
     </div>`)

    }
 
})


socket.on('locationMessage',(url)=>{
  //  console.log(url)


  //to distinguish sent and received messages
    if(url.username===name.toLowerCase()){
      //Insert html into specified position
    document.querySelector("#messages").insertAdjacentHTML("beforeend",
    `<li class="message">
    <div class="message__title__sent">
      <h4>${url.username}</h4>
      <span>${url.createdAt}</span>
    </div>
    <div class="message__body__sent">
      <p>
        <a href="${url.text}" target="_blank">My current location</a>
      </p>
    </div>
  </li>`
  )
    }else{
    

    //Insert html into specified position
    document.querySelector("#messages").insertAdjacentHTML("beforeend",
    `<li class="message">
    <div class="message__title">
      <h4>${url.username}</h4>
      <span>${url.createdAt}</span>
    </div>
    <div class="message__body">
      <p>
        <a href="${url.text}" target="_blank">My current location</a>
      </p>
    </div>
  </li>`
  )
    }
})


//seectinh the form and input field
const messageForm=document.querySelector("form")
const messageInput=document.querySelector("input")
const locationButton=document.querySelector("#send-location")
const messageButton=document.querySelector("#send-button")
const roomTitle=document.querySelector(".room-title")
const userList=document.querySelector(".users")

//on clicking send button
messageForm.addEventListener('submit',(event)=>{
    //preventing default submission of form
    event.preventDefault();

//disables button afetr msg is sent until receiving acknowledgement
      messageButton.disabled = true;

    const message=event.target.elements.message.value
    
    socket.emit("sendMessage",message,(error)=>{

         //clear input field after sending message
         messageInput.value=null
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

socket.emit('join',location.search,(error)=>{
    if(error){
      alert(error)
      location.href='/'
    }    
})

socket.on('roomData',({room,users})=>{
  // console.log(users)
   roomTitle.innerText=room;
  document.querySelector("ul").innerHTML=null
   users.map(user=>{
     userList.insertAdjacentHTML("beforeend",`<li id="usersList">${user.username}</i>`)
   })
})


