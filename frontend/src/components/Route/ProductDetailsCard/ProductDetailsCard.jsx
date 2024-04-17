import React, { useEffect, useState } from "react";
import { AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai";
import { Button } from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import axios from "axios";
import { server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // const [displayCount, setDisplayCount] = useState(5);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  //   const [select, setSelect] = useState(false);

  const handleMessageSubmit = async () => {
    // Gửi tin nhắn
    if (isAuthenticated) {
      // Kiểm tra đã đăng nhập chưa
      const groupTitle = data._id + user._id; // Tiêu đề nhóm
      const userId = user._id; // ID người dùng
      const sellerId = data.shop._id; // ID người bán
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          // Tạo cuộc trò chuyện mới
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`); // Chuyển hướng đến trang inbox
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Vui lòng đăng nhập để trò chuyện");
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleShowMoreClick = () => {
    setShowFullDescription(true);
  };

  const handleShowLessClick = () => {
    setShowFullDescription(false);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã thêm vào giỏ hàng!");
    } else {
      if (data.stock < count) {
        toast.error("Sản phẩm hết hàng!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Thêm thành công sản phẩm!");
      }
    }
  };

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

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={`${data.images && data.images[0]?.url}`} alt="" />

                <div className="flex">
                  <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        {data?.ratings} Đánh giá
                      </h5>
                    </div>
                  </Link>
                </div>
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Gửi tin nhắn <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                {/* <h5 className="text-[16px] text-[red] mt-5">(50) Đã bán</h5> */}
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
                  {showFullDescription
                    ? data?.description
                    : `${data?.description.substring(0, 250)}...`}
                  <br />
                  {!showFullDescription && (
                    <button className="font-bold" onClick={handleShowMoreClick}>
                      Xem thêm
                    </button>
                  )}
                  <br />
                  {showFullDescription && (
                    <button className="font-bold" onClick={handleShowLessClick}>
                      Thu gọn
                    </button>
                  )}
                </p>

                <div className="flex pt-3">
                  <h3 className={`${styles.price}`}>
                    {data.sellPrice
                      ? data.sellPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : null}{" "}
                    / {data.unit}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <Button
                        auto
                        effect={true}
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Xóa sản phẩm yêu thích"
                      />
                    ) : (
                      <Button
                        auto
                        effect={true}
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Thêm sản phẩm yêu thích"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Thêm vào giỏ <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
