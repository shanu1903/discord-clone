const { addNewConnectUser } = require("./../serverStore");

const addNewUserHandler = (socket , io)=>{
    const userId = socket.user.userId;
    addNewConnectUser(socket.id , userId.toString());
}

module.exports = addNewUserHandler;