const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Đăng ký
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      // kiểm tra email đã tồn tại chưa
      return next(new ErrorHandler("Email đã được sử dụng", 400));
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      // tải ảnh lên cloudinary
      folder: "avatars",
    });

    const user = {
      // tạo user mới
      name: name,
      email: email,
      password: password,
      avatar: {
        // thêm avatar
        public_id: myCloud.public_id, // public_id của ảnh
        url: myCloud.secure_url, // url của ảnh
      },
    };

    const activationToken = createActivationToken(user); // tạo token

    const activationUrl = `http://localhost:3000/activation/${activationToken}`; // tạo url

    try {
      await sendMail({
        // gửi mail
        email: user.email,
        subject: "Kích hoạt tài khoản người dùng",
        message: `Xin chào: ${user.name}, Vui lòng nhấn vào đường link bên dưới để kích hoạt tài khoản: ${activationUrl}`,
      });
      res.status(201).json({
        // trả về thông báo
        success: true,
        message: `Kiểm tra:- ${user.email} Để kích hoạt tài khoản!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Tạo token
const createActivationToken = (user) => {
  // tạo token
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m", // thời gian hoạt động của token
  });
};

// Đăng ký
router.post(
  // tạo route
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body; // lấy token từ body

      const newUser = jwt.verify(
        // kiểm tra token
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        // kiểm tra token
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser; // lấy thông tin từ token
      // lấy thông tin từ token
      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("Người dùng đã tồn tại", 400));
      }
      user = await User.create({
        // tạo user mới
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Đăng nhập
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        // kiểm tra thông tin
        return next(new ErrorHandler("Vui lòng điền đủ thông tin!", 400));
      }

      const user = await User.findOne({ email }).select("+password"); // tìm user

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }

      const isPasswordValid = await user.comparePassword(password); //  so sánh mật khẩu

      if (!isPasswordValid) {
        return next(new ErrorHandler("Sai mật khẩu", 400));
      }

      sendToken(user, 201, res); // gửi token
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại", 400));
      }

      res.status(200).json({
        success: true,
        user,
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
      res.cookie("token", null, {
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

//Cập nhật thông tin người dùng
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Sai mật khẩu", 400));
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id); // tìm user
      if (req.body.avatar !== "") {
        // kiểm tra avatar
        if (existsUser.avatar.public_id) {
          // kiểm tra avatar
          const imageId = existsUser.avatar.public_id;

          await cloudinary.v2.uploader.destroy(imageId); // xóa avatar
        }

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          // tải avatar lên cloudinary
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          // thêm avatar
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save(); // lưu avatar

      res.status(200).json({
        // trả về thông báo
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Địa chỉ
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        // kiểm tra địa chỉ
        (address) => address.addressType === req.body.addressType // kiểm tra loại địa chỉ
      );
      if (sameTypeAddress) {
        // kiểm tra loại địa chỉ
        return next(
          new ErrorHandler(`${req.body.addressType} Địa chỉ đã tồn tại`)
        );
      }

      const existsAddress = user.addresses.find(
        // kiểm tra địa chỉ
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        // kiểm tra địa chỉ
        Object.assign(existsAddress, req.body);
      } else {
        //Thêm địa chỉ vào mảng danh sách
        user.addresses.push(req.body);
      }

      await user.save(); // lưu địa chỉ

      res.status(200).json({
        // trả về thông báo
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//xóa địa chỉ
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    // xóa địa chỉ
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        // cập nhật địa chỉ
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } } // xóa địa chỉ
      );

      const user = await User.findById(userId); // tìm user

      res.status(200).json({ success: true, user }); // trả về thông báo
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Cập nhật mật khẩu
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password"); // tìm user

      const isPasswordMatched = await user.comparePassword(
        // so sánh mật khẩu
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        // kiểm tra mật khẩu cũ
        return next(new ErrorHandler("Mật khẩu cũ không đúng!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        // kiểm tra mật khẩu mới
        return next(new ErrorHandler("Mật khẩu không trùng khớp!", 400));
      }
      user.password = req.body.newPassword; // cập nhật mật khẩu

      await user.save();

      res.status(200).json({
        // trả về thông báo
        success: true,
        message: "Đổi mật khẩu thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    // lấy thông tin người dùng
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"), // kiểm tra quyền
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại", 400));
      }

      const imageId = user.avatar.public_id; // lấy public_id của ảnh

      await cloudinary.v2.uploader.destroy(imageId); // xóa ảnh

      await User.findByIdAndDelete(req.params.id); // xóa người dùng

      res.status(201).json({
        // trả về thông báo
        success: true,
        message: "Xóa người dùng thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
