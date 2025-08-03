import "dotenv/config";
import express from "express";
import connectDB from "./database/db.js";
import authRoutes from "./routes/auth_routes.js";
import homeRoutes from "./routes/home_routes.js";
import adminRoutes from "./routes/admin_routes.js";
import imageRoutes from "./routes/image_routes.js";

const app = express();
connectDB();

// Middlewares
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/api/image", imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now listenning to port ${PORT}`);
});
