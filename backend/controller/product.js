const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// Tạo sản phẩm
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId; // Lấy id cửa hàng
      const shop = await Shop.findById(shopId); // Tìm cửa hàng theo id
      if (!shop) {
        return next(new ErrorHandler("Không hợp lệ", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          // Nếu ảnh sản phẩm là 1 ảnh
          images.push(req.body.images); // Thêm ảnh vào mảng images
        } else {
          // Nếu ảnh sản phẩm là nhiều ảnh
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          // Lưu ảnh sản phẩm lên cloudinary
          const result = await cloudinary.v2.uploader.upload(images[i], {
            // Lưu ảnh lên cloudinary
            folder: "products",
          });

          imagesLinks.push({
            // Thêm ảnh vào mảng imagesLinks
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body; // Lấy dữ liệu sản phẩm
        productData.images = imagesLinks; // Thêm ảnh vào sản phẩm
        productData.shop = shop; // Thêm cửa hàng vào sản phẩm

        const product = await Product.create(productData); // Tạo sản phẩm

        res.status(201).json({
          // Trả về thông báo tạo sản phẩm thành công
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-products-by-categories/",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({
        category: req.query.category,
      }).sort({ createdAt: -1 });
      // const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Lấy danh sách sản phẩm
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng có phải là người bán không
    try {
      const products = await Product.find({ shopId: req.params.id }); // Lấy danh sách sản phẩm theo id cửa hàng

      res.status(201).json({
        // Trả về danh sách sản phẩm
        success: true,
        products,
      });
    } catch (error) {
      // Nếu có lỗi thì trả về lỗi 400
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Xóa sản phẩm
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng có phải là người bán không
    try {
      const productId = req.params.id; // Lấy id sản phẩm
      const product = await Product.findById(productId); // Tìm sản phẩm theo id

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm", 404)); // Nếu không tìm thấy sản phẩm thì trả về lỗi 404
      }

      for (let i = 0; i < product.images.length; i++) {
        // Xóa ảnh sản phẩm trên cloudinary
        await cloudinary.v2.uploader.destroy(product.images[i].public_id); // Xóa ảnh trên cloudinary
      }

      await product.deleteOne(); // Xóa sản phẩm

      res.status(201).json({
        // Trả về thông báo xóa sản phẩm thành công
        success: true,
        message: "Xóa sản phẩm thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Lấy danh sách sản phẩm
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 }); // Sắp xếp sản phẩm theo thời gian tạo

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//Chỉnh sửa sản phẩm
"/edit-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id; // Lấy id sản phẩm
      const product = await Product.findById(productId); // Tìm sản phẩm theo id

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
      }

      const {
        // Lấy thông tin sản phẩm
        name,
        entryDate,
        expiryDate,
        price,
        origin,
        tags,
        description,
        specifications,
        category,
        ingredient,
        unit,
        brand,
        quantity,
        originalPrice,
        sellPrice,
        vat,
        weight,
        material,
        guarantee,
        selectedCategory,
        stock,
      } = req.body;

      product.name = name; // Cập nhật thông tin sản phẩm
      product.price = price; // Cập nhật thông tin sản phẩm
      product.description = description;
      product.category = category;
      product.stock = stock;
      product.origin = origin;
      product.tags = tags;
      product.entryDate = entryDate;
      product.expiryDate = expiryDate;
      product.specifications = specifications;
      product.ingredient = ingredient;
      product.unit = unit;
      product.brand = brand;
      product.quantity = quantity;
      product.originalPrice = originalPrice;
      product.sellPrice = sellPrice;
      product.vat = vat;
      product.weight = weight;
      product.material = material;
      product.guarantee = guarantee;
      product.selectedCategory = selectedCategory;

      const updatedProduct = await product.save(); // Cập nhật sản phẩm

      res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  });

// Đánh giá người dùng
router.put(
  "/create-new-review", // Tạo đánh giá mới
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng đã đăng nhập chưa
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId); // Tìm sản phẩm theo id

      const productName = product.name; // Lấy tên sản phẩm

      const review = {
        // Tạo đánh giá
        user,
        rating,
        comment,
        productId,
        productName, // Thêm tên sản phẩm vào đánh giá
      };

      const isReviewed = product.reviews.find(
        // Kiểm tra xem người dùng đã đánh giá sản phẩm chưa
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        // Nếu đã đánh giá thì cập nhật đánh giá
        product.reviews.forEach((rev) => {
          // Cập nhật đánh giá
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user); // Cập nhật đánh giá
          }
        });
      } else {
        product.reviews.push(review); // Thêm đánh giá vào sản phẩm
      }

      let avg = 0; // Tính trung bình đánh giá

      product.reviews.forEach((rev) => {
        // Tính trung bình đánh giá
        avg += rev.rating; // Tính trung bình đánh giá
      });

      product.ratings = avg / product.reviews.length; // Tính trung bình đánh giá

      await product.save({ validateBeforeSave: false }); // Lưu sản phẩm

      await Order.findByIdAndUpdate(
        // Cập nhật đánh giá
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } }, // Cập nhật đánh giá
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Đánh giá thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Sản phẩm -- Admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    // Middleware kiểm tra người dùng có phải là admin không
    try {
      const products = await Product.find().sort({
        // Lấy danh sách sản phẩm
        createdAt: -1,
      });
      res.status(201).json({
        // Trả về danh sách sản phẩm
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
