const mongoose = require("mongoose");

const connectDatabase = () => {
  // Kết nối với database
  mongoose
    .connect(process.env.DB_URL, {
      // Lấy url database từ file .env
      useNewUrlParser: true, // Sử dụng cú pháp mới của mongoose
      useUnifiedTopology: true, // Sử dụng cú pháp mới của mongoose
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
