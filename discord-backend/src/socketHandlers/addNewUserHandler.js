const { addNewConnectUser } = require("./../serverStore");
const {
    updatePendingInvitations,
    updateFriendsList
} = require("./updated/friends");

const addNewUserHandler = (socket , io)=>{
    const userId = socket.user.userId;
    addNewConnectUser(socket.id, userId.toString());
    
    // update pending invitations for the connected user
    updatePendingInvitations(userId);

    // update friends list for the connected user
    updateFriendsList(userId);
}

module.exports = addNewUserHandler;