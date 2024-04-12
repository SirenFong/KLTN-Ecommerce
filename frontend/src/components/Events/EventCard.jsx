import React, { useCallback } from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  //
  const { cart } = useSelector((state) => state.cart); // Lấy giỏ hàng từ store
  const dispatch = useDispatch();

  const addToCartHandler = useCallback(
    (data) => {
      const isItemExists = cart?.some((i) => i._id === data._id); // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
      if (isItemExists) {
        toast.error("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        if (data.stock < 1) {
          // Kiểm tra số lượng sản phẩm còn lại
          toast.error("Số lượng sản phẩm đã hết!");
        } else {
          const cartData = { ...data, qty: 1 }; // Thêm sản phẩm vào giỏ hàng
          dispatch(addTocart(cartData));
          toast.success("Thêm vào giỏ hàng thành công!");
        }
      }
    },
    [cart, dispatch]
  );

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2`}
    >
      <div className="w-full lg:-w[50%] m-auto ml-20">
        <img
          src={data.images[0]?.url}
          alt=""
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p>
          {data.description.length > 200 // Kiểm tra độ dài của description
            ? `${data.description.substring(0, 200)}...` // Giới hạn số ký tự hiển thị
            : data.description}
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[25px] text-[#016FD6] font-Roboto pr-3">
              Giảm giá đặc biệt: {data.discountPrice.toLocaleString()}đ /{" "}
              {data.unit}
            </h5>

            <h5 className="font-[500] text-[18px] text-[#ff5837] ">
              -{data.percentDiscount}(%)
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.sold_out} Đã bán
          </span>
        </div>
        <CountDown data={data} /> {/* Hiển thị thời gian còn lại */}
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>Xem chi tiết</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data)}
          >
            Thêm vào giỏ
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
