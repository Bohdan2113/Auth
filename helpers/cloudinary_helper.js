import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.log("Error while uploading to cloudinary: ", err);
    throw new Error("Error while uploading to cloudinary");
  }
};

export {
  uploadToCloudinary,
};
