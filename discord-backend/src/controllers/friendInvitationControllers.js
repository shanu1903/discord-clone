const UserModel = require("../models/usersModels");
const FriendInvitationModel = require("../models/friendInvitationModel");
const updatePendingInvitations = require("../socketHandlers/updated/friends");
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

const friendInvitationControllers = {
  postFriendInvite,
};

module.exports = friendInvitationControllers;
