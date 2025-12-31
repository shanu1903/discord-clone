const UserModel = require("../models/usersModels");
const FriendInvitationModel = require("../models/friendInvitationModel");
const {
  updatePendingInvitations,
  updateFriendsList,
} = require("../socketHandlers/updated/friends");
const postFriendInvite = async (req, res) => {
  try {
    const { targetMailAddress } = req.body;
    const { mail, userId } = req.user;

    // checking if user is trying  to send invite to himself
    if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
      return res.status(409).json("Sorry, you cannot send invite to yourself");
    }

    // check if target user exists
    const targetUser = await UserModel.findOne({
      mail: targetMailAddress.toLowerCase(),
    });
    if (!targetUser) {
      return res.status(404).json("User with this mail address does not exist");
    }

    // check if invitation already sent

    const frinedInvitationAlreadySent = await FriendInvitationModel.findOne({
      senderId: userId,
      receiverId: targetUser._id,
    });

    if (frinedInvitationAlreadySent) {
      return res.status(409).json("Frined invitation already sent");
    }

    // check if thet are already friends
    const alreadyFriends = targetUser.friends.find(
      (friendId) => friendId.toString() === userId.toString()
    );

    if (alreadyFriends) {
      return res.status(409).json("User is already your friend");
    }

    // create a new friend invitation
    await FriendInvitationModel.create({
      senderId: userId,
      receiverId: targetUser._id,
    });

    updatePendingInvitations(targetUser._id.toString());

    return res.status(201).json("Friend invitation sent successfully");
  } catch (error) {
    console.error("Error in postFriendInvite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postAcceptInvite = async (req, res) => {
  try {
    const { id: invitationId } = req.body;

    // does invitation exist
    const invitation = await FriendInvitationModel.findOne({
      _id: invitationId,
    });

    if (invitation) {
      // update friends list in bother sender and receiver user
      const { senderId, receiverId } = invitation;

      const senderUser = await UserModel.findById(senderId);
      const receiverUser = await UserModel.findById(receiverId);

      senderUser.friends = [...senderUser.friends, receiverId];
      receiverUser.friends = [...receiverUser.friends, senderId];

      await senderUser.save();
      await receiverUser.save();

      // now delete invitation from model
      await FriendInvitationModel.findByIdAndDelete(invitationId);

      // update frinds list for both sender and receiver user
      updateFriendsList(senderId);
      updateFriendsList(receiverId);
      // update pending invitation for user
      updatePendingInvitations(receiverId);
    }
  } catch (error) {
    console.error("Error in postAcceptInvite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postRejectInvite = async (req, res) => {
  try {
    const { id: invitationId } = req.body;
    // does invitation exists
    const invitation = await FriendInvitationModel.findOne({
      _id: invitationId,
    });

    if (invitation) {
      await FriendInvitationModel.findByIdAndDelete(invitationId);
    }
  } catch (error) {
    console.error("Error in postRecjectInvite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const friendInvitationControllers = {
  postFriendInvite,
  postRejectInvite,
  postAcceptInvite,
};

module.exports = friendInvitationControllers;
