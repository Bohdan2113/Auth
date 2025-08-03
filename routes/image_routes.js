import express from "express";
import authMiddlware from "../middlware/auth_middleware.js";
import adminMiddlware from "../middlware/admin_middleware.js";
import uploadMiddleware from "../middlware/image_upload_middleware.js";
import {
  uploadImage,
  feetchImages,
  deleteImage,
} from "../controllers/image_controller.js";

const router = express.Router();

// upload the image
router.post(
  "/upload",
  authMiddlware,
  adminMiddlware,
  uploadMiddleware.single("image"),
  uploadImage
);

//get all the images
router.get("/fetch", authMiddlware, feetchImages);

//delete img
router.delete("/:id", authMiddlware, adminMiddlware, deleteImage);

export default router;
