import Image from "../models/Image.js";
import { uploadToCloudinary } from "../helpers/cloudinary_helper.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const uploadImage = async (req, res) => {
  try {
    // check if file is missing in reqest obj
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    // Upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the img url and public id along with the uploaded user id in db
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    // delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (err) {
    console, log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

const feetchImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages,
        totalImages,
        data: images,
      });
    }
  } catch (err) {
    console, log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getCurrentImgIdToDelete = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentImgIdToDelete);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image is not found",
      });
    }

    //chack if the img is uploaded by current user who is trying to delete it
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this image. Because you hevn`t uploaded it.",
      });
    }

    // delete img from cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    //delete this img from mongoDB
    await Image.findByIdAndDelete(getCurrentImgIdToDelete);

    res.status(203).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

export { uploadImage, feetchImages, deleteImage };
