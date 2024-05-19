// import { createReducer } from "@reduxjs/toolkit";

// const initialState = {
//   cart: localStorage.getItem("cartItems")
//     ? JSON.parse(localStorage.getItem("cartItems"))
//     : [],
// };

// export const cartReducer = createReducer(initialState, {
//   addToCart: (state, action) => {
//     const item = action.payload;
//     const isItemExist = state.cart.find((i) => i._id === item._id);
//     if (isItemExist) {
//       return {
//         ...state,
//         cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i)),
//       };
//     } else {
//       return {
//         ...state,
//         cart: [...state.cart, item],
//       };
//     }
//   },

//   removeFromCart: (state, action) => {
//     return {
//       ...state,
//       cart: state.cart.filter((i) => i._id !== action.payload),
//     };
//   },
// });
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

export const cartReducer = createReducer(initialState, {
  // update user address
  updateUserCartRequest: (state) => {
    state.cartloading = true;
  },
  updateUserCartSuccess: (state, action) => {
    state.cartloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  },
  updateUserCartFailed: (state, action) => {
    state.cartloading = false;
    state.error = action.payload;
  },

  //
  LoadUserCartRequest: (state) => {
    state.loading = true;
  },
  LoadUserCartSuccess: (state, action) => {
    state.isAuthenticated = true;
    state.loading = false;
    state.cart = action.payload;
  },
  LoadUserCartFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  },
});
