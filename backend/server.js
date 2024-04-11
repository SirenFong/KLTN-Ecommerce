const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (err) => {
  // uncaught exception
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  // Nếu không phải production
  require("dotenv").config({
    path: "config/.env",
  });
}

// Kết nối database
connectDatabase();

cloudinary.config({
  // Cấu hình cloudinary
  cloud_name: process.env.CLOUDINARY_NAME, // Lấy cloud_name từ file .env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  // Tạo server
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  // Bắt lỗi promise rejection
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
