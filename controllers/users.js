import jwt from "jsonwebtoken";
import express, { response } from "express";
const router = express.Router({ mergeParams: true });
import User from "../models/User.js";

const createToken = ({ id, username }) => {
  return jwt.sign({ username, id }, process.env.JWT_SECRET, {
    expiresIn: "4d",
  });
};

const userController = {
  signup: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.signup(username, password);
      const token = createToken(user);

      res.status(201).json({ token, user });
    } catch (err) {
      let status = 500;
      // See ../models/User.js for message
      if (err.message == "Username is taken.") {
        status = 422;
      } else {
        console.error(err);
      }

      res.status(status).json({ message: err.message });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.login(username, password);
      const token = createToken(user);

      res.status(200).send({ token, user });
    } catch (err) {
      let status = 500;
      // See ../models/User.js for message
      if (/Invalid/.test(err.message)) {
        status = 401;
      } else {
        console.error(err);
      }

      res.status(status).json({ message: err.message });
    }
  },
  verifyToken: async (req, res) => {
    try {
      //verified in middleware with protected route
      return res.status(200).json({ message: "valid token" });
    } catch (err) {
      return res.status(401).json({ message: "invalid token" });
    }
  },
  changeUsername: async (req, res) => {
    try {
      // verify that password is correct, and also that the username matches
      // the current user
      const loggedInUser = await User.login(
        req.body.username,
        req.body.password
      );
      if (req.user.username != req.body.username || !loggedInUser)
        throw new Error("Invalid credentials");
      const usernameExists = await User.findOne({
        username: req.body.newUsername,
      });
      if (usernameExists) throw new Error("Username exists");
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          username: req.body.newUsername,
        }
      );

      res.status(200).json({ message: "Success" });
    } catch (err) {
      let status = 500;
      if (err.message == "Invalid credentials") {
        status = 401;
      } else if (err.message == "Username exists") {
        status = 403;
      } else {
        console.error(err);
      }

      res.status(status).json({ message: err.message });
    }
  },
};

export default userController;
