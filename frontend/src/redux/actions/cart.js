// actions/cart.js
import axios from "axios"; // Import axios for HTTP requests

// Thêm sản phẩm vào giỏ hàng và lưu vào cơ sở dữ liệu
export const addTocart = (data) => async (dispatch, getState) => {
  try {
    // Dispatch action
    dispatch({
      type: "addToCart",
      payload: data,
    });

    // Lưu vào cơ sở dữ liệu MongoDB
    const token = getState().user.token; // Lấy token từ Redux store, bạn cần đảm bảo đã đăng nhập trước khi thực hiện thêm sản phẩm vào giỏ hàng
    await axios.post("/api/user/cart", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Xử lý lỗi nếu cần thiết
    return null;
  }
};

// Xóa sản phẩm khỏi giỏ hàng và cập nhật cơ sở dữ liệu
export const removeFromCart = (data) => async (dispatch, getState) => {
  try {
    // Dispatch action
    dispatch({
      type: "removeFromCart",
      payload: data._id,
    });

    // Cập nhật cơ sở dữ liệu MongoDB
    const token = getState().user.token; // Lấy token từ Redux store
    await axios.delete(`/api/user/cart/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    // Xử lý lỗi nếu cần thiết
    return null;
  }
};
