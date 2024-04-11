//Token lưu vào cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken(); // Lấy token từ user

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 ngày
    httpOnly: true, // Chỉ có server mới có thể truy cập cookie
    sameSite: "none", // Chỉ cho phép gửi cookie khi request từ cùng một domain
    secure: true, // Chỉ cho phép gửi cookie qua HTTPS
  };

  res.status(statusCode).cookie("token", token, options).json({
    // Lưu token vào cookie
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
