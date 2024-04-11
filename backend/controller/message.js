const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const cloudinary = require("cloudinary");
const router = express.Router();

// tạo tin nhắn mới
router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      if (req.body.images) {
        // nếu có hình ảnh
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          // tải hình ảnh lên cloudinary
          folder: "messages",
        });
        messageData.images = {
          // trả về thông tin hình ảnh
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

      messageData.conversationId = req.body.conversationId; // lấy thông tin từ body
      messageData.sender = req.body.sender; // lấy thông tin từ body
      messageData.text = req.body.text; // lấy thông tin từ body

      const message = new Messages({
        // tạo tin nhắn mới
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// load danh sách trò chuyện
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        // tìm kiếm tin nhắn
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
