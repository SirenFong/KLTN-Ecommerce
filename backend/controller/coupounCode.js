const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

// Tạo mã giảm giá
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, minAmount, maxAmount, selectedProducts, value, shopId } =
        req.body;

      // Kiểm tra xem mã giảm giá có tồn tại chưa
      const isCoupounCodeExists = await CoupounCode.findOne({ name });

      if (
        isCoupounCodeExists &&
        isCoupounCodeExists.shopId.toString() === shopId
      ) {
        return next(
          new ErrorHandler("Mã giảm giá đã tồn tại trong cửa hàng này!", 400)
        );
      }

      // Tạo mã giảm giá
      const coupounCode = await CoupounCode.create({
        name,
        minAmount,
        maxAmount,
        selectedProducts,
        value,
        shopId,
      });

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// Load mã giảm giá
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Xóa mã giảm giá
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Mã giảm giá không tồn tại!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Xóa mã giảm giá thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/get-all-coupons",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({});
      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
