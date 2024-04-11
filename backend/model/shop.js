const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên cửa hàng!"],
  },
  email: {
    type: String,
    required: [true, "Địa chỉ Email không được để trống!"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được để trống!"],
    minLength: [6, "Mật khẩu từ 6 ký tự trở lên!"],
    select: false,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  zipCode: {
    type: Number,
    required: true,
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Đang chờ xử lý",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Mã hóa mật khẩu trước khi lưu vào database
shopSchema.pre("save", async function (next) {
  // Hash password
  if (!this.isModified("password")) {
    // Nếu mật khẩu không được thay đổi thì next
    next(); // Bỏ qua
  }
  this.password = await bcrypt.hash(this.password, 10); // Hash password
});

// jwt token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES, // Thời gian hết hạn của token
  });
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // So sánh mật khẩu
};

module.exports = mongoose.model("Shop", shopSchema);
