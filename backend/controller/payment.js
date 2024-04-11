const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process payment route
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // xử lý thanh toán
      const myPayment = await stripe.paymentIntents.create({
        // tạo paymentIntent
        amount: req.body.amount,
        currency: "VND",
        metadata: {
          company: "ThanhThuong", // thông tin metadata
        },
      });

      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Payment processing failed" }); // thông báo lỗi
    }
  })
);

// Get Stripe API key route
router.get(
  "/stripeapikey", // lấy api key của stripe
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY }); // trả về api key
  })
);

module.exports = router;
