const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { productSchema } = require("../model/product");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên người dùng không được để trống!"],
  },
  email: {
    type: String,
    required: [true, "Email không được để trống!"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được để trống!"],
    minLength: [6, "Mật khẩu từ 6 ký tự trở lên!"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  wishList: [
    {
      product: productSchema,
    },
  ],
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String, // Reset password token
  resetPasswordTime: Date, // Reset password time
});

//  Hash password
userSchema.pre("save", async function (next) {
  // Hash password
  if (!this.isModified("password")) {
    // Nếu mật khẩu không được thay đổi
    next(); // Bỏ qua
  }

  this.password = await bcrypt.hash(this.password, 10); // Hash password
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    // Tạo token
    expiresIn: process.env.JWT_EXPIRES, // Thời gian hết hạn của token
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // So sánh mật khẩu
};

module.exports = mongoose.model("User", userSchema);
