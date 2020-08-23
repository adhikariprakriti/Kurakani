const users=[];

//addnew user
const addUser=({id,username,room})=>{

    if(!username || !room){
        return{
            error:"username and room are required"
        }
    }

    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    

    //check existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //validate user
    if(existingUser){
        return {
            error: "username already exists"
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
  
    return {user}
}

const getUser=(id)=>{
     return users.find((user)=>user.id===id)
}

const getUsersInRoom=(room)=>{
    if(room){
    room=room.trim().toLowerCase()
    }
      return users.filter((user)=>user.room===room)
}

//remove user
const removeUser=(id)=>{
       const index=users.findIndex((user)=>user.id===id)
       if(index !==-1){
           return users.splice(index,1)
       }
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}