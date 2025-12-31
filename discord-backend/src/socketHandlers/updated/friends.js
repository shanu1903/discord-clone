const FriendInvitationModel = require("../../models/friendInvitationModel");
const usersModels = require("../../models/usersModels");
const {
  getActiveConnections,
  getSocketInstance,
} = require("../../serverStore");

const updatePendingInvitations = async (userId) => {
  // logic to update pending invitations for the user with userId

  try {
    const pendingInvitations = await FriendInvitationModel.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail");


    const activeConnections = getActiveConnections(userId);
    const io = getSocketInstance();
    activeConnections.forEach((socketId) => {
      io.to(socketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (error) {
    console.error("Error in updatePendingInvitations:", error);
  }
};

const updateFriendsList = async (userId) => {
  const activeConnections = getActiveConnections(userId);

  if (activeConnections.length > 0) {
    const user = await usersModels
      .findById(userId)
      .populate("friends", "_id mail username");
    const io = getSocketInstance();
    activeConnections.forEach((socketId) => {
      io.to(socketId).emit("friends-list", {
        friends:
          user.friends?.map((friend) => ({
            id: friend._id,
            mail: friend.mail,
            username: friend.username,
          })) ?? [],
      });
    });
  }
};

module.exports = { updatePendingInvitations, updateFriendsList };
