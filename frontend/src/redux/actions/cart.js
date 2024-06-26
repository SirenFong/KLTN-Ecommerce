import axios from "axios";
import { server } from "../../server";

// load user
export const loadUserCart = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserCartRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserCartSuccess",
      payload: data.user.cart,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserCartFail",
      payload: error.response.data.message,
    });
  }
};

// update user address
export const addTocart = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "updateUserCartRequest",
    });
    console.log(id);
    const { data } = await axios.put(
      `${server}/user/add-user-cart`,
      {
        id,
      },
      { withCredentials: true }
    );
    console.log("data");
    console.log(data);
    dispatch({
      type: "updateUserCartSuccess",
      payload: {
        successMessage: "Đã cập nhật giỏ hàng thành công !!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "updateUserCartFailed",
      payload: error.response.data.message,
    });
  }
};

// update user address
export const removetocart = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "updateUserCartRequest",
    });
    console.log(id);
    const { data } = await axios.put(
      `${server}/user/remove-from-cart/${id}`,
      {},
      { withCredentials: true }
    );
    console.log("data");
    console.log(data);
    dispatch({
      type: "updateUserCartSuccess",
      payload: {
        successMessage: "Đã câp nhật giỏ hàng thành công !",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "updateUserCartFailed",
      payload: error.response.data.message,
    });
  }
};

// clear cart
export const clearCart = () => (dispatch) => {
  dispatch({
    type: "ClearCart",
  });
};
