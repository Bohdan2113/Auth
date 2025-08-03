import express from "express";
import authMiddlware from "../middlware/auth_middleware.js";

const router = express.Router();

router.get("/welcome", authMiddlware, (req, res) => {
  const { username, userId, role } = req.userInfo;
  res.json({
    message: "Welcome to the home page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

export default router;
