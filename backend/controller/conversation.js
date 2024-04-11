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
      const { groupTitle, userId, sellerId } = req.body; // lấy thông tin từ body

      const isConversationExist = await Conversation.findOne({ groupTitle }); // kiểm tra xem cuộc trò chuyện đã tồn tại chưa

      if (isConversationExist) {
        // nếu tồn tại
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        // nếu chưa tồn tại
        const conversation = await Conversation.create({
          // tạo mới cuộc trò chuyện
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
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
