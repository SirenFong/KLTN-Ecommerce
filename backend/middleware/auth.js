const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Kiểm tra người dùng đã đăng nhập chưa
  const { token } = req.cookies;
  console.log(token)
  if (!token) {
    // Nếu chưa đăng nhập
    return next(new ErrorHandler("Vui lòng đăng nhập", 401)); // Trả về lỗi 401
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Giải mã token

  req.user = await User.findById(decoded.id); // Tìm người dùng theo id

  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies; // Lấy token từ cookie
  if (!seller_token) {
    // Nếu không có token
    return next(new ErrorHandler("Vui lòng đăng nhập", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id); // Tìm cửa hàng theo id

  next();
});

exports.isAdmin = (...roles) => {
  // Kiểm tra quyền truy cập
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};
