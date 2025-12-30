const connectUsers = new Map();

const addNewConnectUser = (socketId , userId)=>{
    connectUsers.set(socketId , userId);
    console.log("new user connected");
    console.log(connectUsers)
}


const removeConnectUser = (socketId)=>{
    connectUsers.delete(socketId);
    console.log("user disconnected");
    console.log(connectUsers)
} 



module.exports = {
    addNewConnectUser,
    removeConnectUser
}