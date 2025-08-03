import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register controller
const registerUser = async (req, res) => {
  try {
    // extract user info from our request body
    const { username, email, password, role } = req.body;

    // check if user is already exists in our db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists either with same username or same email. Please try with different username or email",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user and save to db
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User registereed successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register. Please try again",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find if the current user exist in db
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist!",
      });
    }

    // if the password is correct or not
    const isPasswiordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswiordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password!",
      });
    }

    // create user jwt
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // extract old and new password
    const { oldPassword, newPassword } = req.body;

    // check if password are the same
    if (oldPassword === newPassword) {
      return res.status(401).json({
        success: false,
        message: "The new password is the same as old one.",
      });
    }

    // find current logged in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not found",
      });
    }

    // check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    } else {
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      // update user password
      user.password = newHashedPassword;
      await user.save();

      res.status(201).json({
        success: true,
        message: "Password has been changed successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

export { registerUser, loginUser, changePassword };
