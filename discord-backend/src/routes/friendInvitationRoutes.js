const express = require("express");
const router = express.Router();
const joi = require("joi");
const validateToken = require("../middlewares/authMiddlewares");
const friendInvitationControllers = require("../controllers/friendInvitationControllers");

const validator = require("express-joi-validation").createValidator({});

const friendInvitationSchema = joi.object({
  targetMailAddress: joi.string().email().required(),
});

const inviteDecisionSchema = joi.object({
  id: joi.string().required(),
});

router.post(
  "/invite",
  validator.body(friendInvitationSchema),
  validateToken,
  friendInvitationControllers.postFriendInvite
);

router.post(
  "/accept",
  validateToken,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.postAcceptInvite
);

router.post(
  "./reject",
  validateToken,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.postRejectInvite
);

module.exports = router;
