module.exports = (theFunc) => (req, res, next) => {
  // Bắt lỗi khi có lỗi xảy ra
  Promise.resolve(theFunc(req, res, next)).catch(next); // Bắt lỗi
};
