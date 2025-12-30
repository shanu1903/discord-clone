const express = require("express");
const router = express.Router();
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});


const loginSchema = joi.object({
  mail: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const registerSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  mail: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const {
  loginController,
  registerController,
} = require("../controllers/authControllers");

router.post("/login", validator.body(loginSchema), loginController);

router.post("/register", validator.body(registerSchema), registerController);

module.exports = router;
