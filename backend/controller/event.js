const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary"); // thư viện cloudinary

const uploadImage = async (image) => {
  const result = await cloudinary.v2.uploader.upload(image, {
    // tải hình ảnh lên cloudinary
    folder: "products",
  });
  return {
    // trả về thông tin hình ảnh
    public_id: result.public_id,
    url: result.secure_url,
  };
};
// Tạo sự kiện
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    const { shopId, images, ...productData } = req.body; // lấy thông tin từ body

    if (!shopId || !images || !productData) {
      // kiểm tra thông tin
      return next(new ErrorHandler("Chưa nhập đủ thông tin", 400)); // kiểm tra thông tin
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Lỗi vui lòng thử lại", 400));
    }

    const imagesArray = typeof images === "string" ? [images] : images; // chuyển hình ảnh thành mảng
    const imagesLinks = []; // mảng chứa hình ảnh

    for (const image of imagesArray) {
      // duyệt qua từng hình ảnh
      try {
        const imageLink = await uploadImage(image); // tải hình ảnh
        imagesLinks.push(imageLink); // thêm hình ảnh vào mảng
      } catch (error) {
        return next(
          new ErrorHandler(`Lỗi khi tải hình ảnh: ${error.message}`, 400)
        );
      }
    }

    const event = await Event.create({
      // tạo sự kiện
      ...productData,
      shopId,
      images: imagesLinks, // thêm hình ảnh
      shop,
    });

    res.status(201).json({
      success: true,
      event,
    });
  })
);

// Load tất cả sự kiện
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find(); // tìm kiếm sự kiện
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Load sự kiện
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id }); // tìm kiếm sự kiện

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Xóa sự kiện
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id); // tìm kiếm sự kiện

      if (!event) {
        // kiểm tra sự kiện
        return next(new ErrorHandler("Không tìm thấy sự kiện", 404));
      }

      for (let i = 0; i < event.images.length; i++) { // duyệt qua từng hình ảnh
        // xóa hình ảnh
        await cloudinary.v2.uploader.destroy(event.images[i].public_id); 
      }

      await event.deleteOne(); // xóa sự kiện

      res.status(201).json({
        // trả về thông báo
        success: true,
        message: "Xóa sự kiện thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Sự kiện - Admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
