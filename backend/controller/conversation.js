const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// Tạo mới cuộc trò chuyện
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa người dùng và người bán hàng
      const existingConversation = await Conversation.findOne({
        members: { $all: [userId, sellerId] },
      });

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          conversation: existingConversation,
          message: "Trò chuyện đã tồn tại.",
        });
      }

      // Nếu cuộc trò chuyện chưa tồn tại, tạo mới
      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      return res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Internal server error", 500)
      );
    }
  })
);

// Load tin nhắn
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        // tìm kiếm cuộc trò chuyện
        members: {
          // tìm kiếm người dùng
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 }); // sắp xếp theo thời gian

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// load tin nhắn người dùng
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        // tìm kiếm cuộc trò chuyện
        members: {
          $in: [req.params.id], // tìm kiếm người dùng
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        // trả về thông tin
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// cập nhật tin nhắn
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        // tìm kiếm cuộc trò chuyện
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        // trả về thông tin
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
