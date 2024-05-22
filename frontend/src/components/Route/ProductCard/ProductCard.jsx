import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../stylezs/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import { makeStyles } from "@material-ui/core";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data._id, wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã được thêm vào giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm tạm hết!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Thêm thành công!");
      }
    }
  };

  const useStyles = makeStyles({
    productCard: {
      maxWidth: "100%",
      height: 330,
      boxShadow: "0 0 10px 0 rgba(0,0,0,0.12)",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
        transform: "scale(1.05)",
      },
    },
    productImage: {
      height: 170,
      width: "100%",
      objectFit: "contain",
      transition: "all 0.3s",
      "&:hover": {
        opacity: 0.75,
      },
    },
  });
  const classes = useStyles();
  return (
    <>
      <div
        className={`w-full bg-white rounded-lg p-3 relative cursor-pointer ${classes.productCard}`}
      >
        <div className="flex justify-end"></div>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt=""
            className={classes.productImage}
          />
        </Link>

        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h4 className={`${styles.price} pr-2`}>
                {data.discountPrice || data.sellPrice
                  ? (data.discountPrice || data.sellPrice).toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )
                  : "0"}
              </h4>
              {data.discountPrice && (
                <h5 className="font-[500] text-[15px] text-[#ff5837] ">
                  {data.percentDiscount}(%)
                </h5>
              )}
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              Đã bán {data?.sold_out || 0}
            </span>
          </div>
        </Link>

        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Xóa sản phẩm yêu thích"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Thêm vào yêu thích"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Xem nhanh"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Thêm vào giỏ hàng"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
