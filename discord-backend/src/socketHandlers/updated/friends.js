const FriendInvitationModel = require("../../models/friendInvitationModel");
const { getActiveConnections, getSocketInstance } = require("../../serverStore");

const updatePendingInvitations = async (userId) => {
  // logic to update pending invitations for the user with userId

  try {
    const pendingInvitations = await FriendInvitationModel.find({
      receiverId: userId,
    }).populate("senderId", "_id username mail");
      
    console.log("pending invitations for user ", userId, ": ", pendingInvitations);

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

module.exports = updatePendingInvitations;
