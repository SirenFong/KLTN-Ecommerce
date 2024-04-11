class ErrorHandler extends Error {
  // Tạo class ErrorHandler kế thừa từ class Error
  constructor(message, statusCode) {
    // Hàm khởi tạo với 2 tham số message và statusCode
    super(message); // Gọi hàm khởi tạo của class cha với tham số message
    this.statusCode = statusCode; // Gán giá trị statusCode

    Error.captureStackTrace(this, this.constructor); // Gán stack trace cho lỗi
  }
}
module.exports = ErrorHandler;
