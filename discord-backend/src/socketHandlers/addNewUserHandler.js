const { addNewConnectUser } = require("./../serverStore");

const addNewUserHandler = (socket , io)=>{
    const userId = socket.user.userId;
    addNewConnectUser(socket.id , userId);
}

module.exports = addNewUserHandler;