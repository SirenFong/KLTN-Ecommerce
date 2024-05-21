import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  cart: [],
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

  // load user cart
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

  // clear cart
  ClearCart: (state) => {
    state.cart = [];
  },
});
