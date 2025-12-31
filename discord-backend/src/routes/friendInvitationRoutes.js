const express = require("express");
const router = express.Router();
const joi = require("joi");
const validateToken = require("../middlewares/authMiddlewares");
const friendInvitationControllers = require("../controllers/friendInvitationControllers");

const validator = require("express-joi-validation").createValidator({});

const friendInvitationSchema = joi.object({
  targetMailAddress: joi.string().email().required(),
});

router.post(
  "/invite",
  validator.body(friendInvitationSchema),
  validateToken,
  friendInvitationControllers.postFriendInvite
);

module.exports = router;
