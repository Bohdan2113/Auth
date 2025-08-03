import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/auth_controller.js";
import authMiddlware from "../middlware/auth_middleware.js";

const router = express.Router();

// all routes are related to authentication and authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changepassword", authMiddlware, changePassword);

export default router;
