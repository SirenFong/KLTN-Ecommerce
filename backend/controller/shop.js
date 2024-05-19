const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// Đăng ký cửa hàng mới
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body; // Lấy email từ req.body
      const sellerEmail = await Shop.findOne({ email }); // Tìm cửa hàng theo email
      if (sellerEmail) {
        // Nếu cửa hàng đã tồn tại
        return next(new ErrorHandler("User already exists", 400));
      }

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        // Lưu ảnh cửa hàng lên cloudinary
        folder: "avatars",
      });

      const seller = {
        // Tạo cửa hàng mới
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: {
          // Thêm ảnh vào cửa hàng
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        // Thêm thông tin cửa hàng
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };

      const activationToken = createActivationToken(seller); // Tạo token kích hoạt

      const activationUrl = `https://nhathuocthanhthuong.vercel.app/seller/activation/${activationToken}`; // Tạo đường link kích hoạt

      try {
        await sendMail({
          // Gửi email kích hoạt
          email: seller.email,
          subject: "Kích hoạt cửa hàng",
          message: `Xin chào ${seller.name}, Nhấn vào đường link bên dưới để kích hoạt tài khoản: ${activationUrl}`, // Nội dung email
        });
        res.status(201).json({
          // Trả về thông báo gửi email kích hoạt thành công
          success: true,
          message: `Đã gửi Email:- ${seller.email} để kích hoạt!`,
        });
      } catch (error) {
        // Bắt lỗi
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Tạo token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// kích hoạt tài khoản
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    // Bắt lỗi
    try {
      const { activation_token } = req.body; // Lấy token từ req.body

      const newSeller = jwt.verify(
        // Xác thực token
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        // Nếu không có token
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller; // Lấy thông tin cửa hàng từ token

      let seller = await Shop.findOne({ email }); // Tìm cửa hàng theo email

      if (seller) {
        //  Nếu cửa hàng đã tồn tại
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        // Tạo cửa hàng mới
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res); // Gửi token
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Đăng nhập
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Xin vui lòng nhập đúng mật khẩu", 400));
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng có phải là người bán không
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        // Nếu không tìm thấy người dùng
        return next(new ErrorHandler("Người dùng không hợp lệ", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // xóa token
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()), // hết hạn
        httpOnly: true,
        sameSite: "none", // sameSite: "none" for cross-site cookies
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// router.get(
//   "/logout",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       res.cookie("seller_token", "", {
//         expires: new Date(0), // Cookie expires immediately
//         httpOnly: true,
//         sameSite: "none",
//         secure: process.env.NODE_ENV === "production", // Secure in production
//       });
//       res.status(200).json({
//         success: true,
//         message: "Đã đăng xuất!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

//Load thông tin cửa hàng
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Cập nhật ảnh
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id); // Tìm cửa hàng theo id

      const imageId = existsSeller.avatar.public_id; // Lấy public_id của ảnh

      await cloudinary.v2.uploader.destroy(imageId); // Xóa ảnh trên cloudinary

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        // Tải ảnh lên cloudinary
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        // Cập nhật ảnh mới
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsSeller.save(); // Lưu cửa hàng

      res.status(200).json({
        // Trả về thông báo cập nhật ảnh thành công
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      // Bắt lỗi
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Cật nhật người dùng
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng có phải là người bán không
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body; // Lấy thông tin cửa hàng từ req.body

      const shop = await Shop.findOne(req.seller._id); // Tìm cửa hàng theo id

      if (!shop) {
        // Nếu không tìm thấy cửa hàng
        return next(new ErrorHandler("Không tìm thấy người dùng", 400));
      }
      // Cập nhật thông tin cửa hàng
      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save(); // Lưu cửa hàng

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      // Bắt lỗi
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Dược sỹ -- Admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        // Lấy danh sách cửa hàng
        createdAt: -1, // Sắp xếp theo thời gian tạo
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Xóa dược sỹ -- Admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(new ErrorHandler("Dược sỹ không tồn tại", 400));
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "xóa thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// router.put(
//   "/update-payment-methods",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { withdrawMethod } = req.body;

//       const seller = await Shop.findByIdAndUpdate(req.seller._id, {
//         // Cập nhật phương thức thanh toán
//         withdrawMethod,
//       });

//       res.status(201).json({
//         success: true,
//         seller,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.delete(
//   "/delete-withdraw-method/",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const seller = await Shop.findById(req.seller._id);

//       if (!seller) {
//         return next(new ErrorHandler("Không tìm thấy cửa hàng", 400));
//       }

//       seller.withdrawMethod = null;

//       await seller.save();

//       res.status(201).json({
//         success: true,
//         seller,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;
