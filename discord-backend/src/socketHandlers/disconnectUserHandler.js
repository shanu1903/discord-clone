const { removeConnectUser } = require("../serverStore");

const disconnectUserHandler = (socket , io)=>{
    removeConnectUser(socket.id);
}


module.exports = disconnectUserHandler;