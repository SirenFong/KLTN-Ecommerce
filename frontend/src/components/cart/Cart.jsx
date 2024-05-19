import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
// import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, loadUserCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const Cart = ({ setOpenCart }) => {
  const { user } = useSelector((state) => state.user); // Lấy giỏ hàng từ store
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    // Xóa sản phẩm khỏi giỏ hàng
    dispatch();
  };

  const totalPrice = user.cart.reduce(
    // Tính tổng giá tiền
    (acc, item) =>
      acc + item.qty * item.sellPrice || acc + item.discountPrice * item.qty, // Tính giá tiền sau khi giảm giá
    0
  );

  const quantityChangeHandler = (data) => {
    // Thay đổi số lượng sản phẩm
    dispatch(addTocart(data));
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100vh"
      bgcolor="rgba(0, 0, 0, 0.3)"
      zIndex={10}
    >
      <Box
        position="fixed"
        top={0}
        right={0}
        height="100%"
        width={{ xs: "80%", md: "25%" }}
        bgcolor="white"
        display="flex"
        flexDirection="column"
        overflow="auto"
        boxShadow={1}
      >
        {user.cart && user.cart.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Box
              position="fixed"
              top={3}
              right={3}
              display="flex"
              justifyContent="flex-end"
            >
              <IconButton onClick={() => setOpenCart(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="h5">Giỏ hàng đang trống!</Typography>
          </Box>
        ) : (
          <>
            <Box p={2}>
              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={() => setOpenCart(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" p={1}>
                <ShoppingCartIcon />
                <Typography variant="h5" pl={2}>
                  {user.cart && user.cart.length} sản phẩm
                </Typography>
              </Box>

              <Divider />

              <List>
                {user.cart &&
                  user.cart.map((i, index) => (
                    <ListItem key={index}>
                      <CartSingle
                        data={i}
                        quantityChangeHandler={quantityChangeHandler}
                        removeFromCartHandler={removeFromCartHandler}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>

            <Box p={2} mb={2}>
              <Link to="/checkout">
                <Button variant="contained" color="primary" fullWidth>
                  Thanh toán ngay ({totalPrice.toLocaleString("vi-VN")} VNĐ)
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);

  const totalPrice = data.sellPrice * value;
  const dispatch = useDispatch();

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Sản phẩm đã hết!");
    } else {
      dispatch(addTocart(data._id));
      setValue(value + 1);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-4">
      <RxCross1
        size={25}
        className="cursor-pointer"
        onClick={() => removeFromCartHandler(data)}
      />
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[90px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            {(data.sellPrice || data.discountPrice).toLocaleString()} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#016FD6] font-Roboto">
            {(totalPrice || data.discountPrice).toLocaleString()} VNĐ
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Cart;
