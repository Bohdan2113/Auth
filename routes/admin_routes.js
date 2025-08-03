import express from "express";
import authMiddlware from "../middlware/auth_middleware.js";
import adminMiddlware from "../middlware/admin_middleware.js";

const router = express.Router();

router.get("/info", authMiddlware, adminMiddlware, (req, res) => {
  const { username, userId, role } = req.userInfo;
  res.json({
    message: "Welcome to the admin info page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

export default router;
