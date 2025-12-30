const User = require("../models/usersModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {

        const jwtToken = jwt.sign(
          { userId: user._id, mail: user.mail },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          username: user.username,
          token: jwtToken
        },
      });
    }

    return res.status(400).send("Invalid credentials");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const registerController = async (req, res) => {
  try {
    // Handle registration logic here
    const { username, mail, password } = req.body;

    // check if user already exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: hashPassword,
    });

    const JWTToken = jwt.sign(
      { userId: newUser._id, mail: newUser.mail },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      userDetails: {
        mail: newUser.mail,
        username: newUser.username,
        token: JWTToken,
      },
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
  loginController,
  registerController,
};
