import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = orders && orders.find((item) => item._id === id); // Tìm đơn hàng theo id

  const orderUpdateHandler = async (e) => {
    // Cập nhật trạng thái đơn hàng
    await axios
      .put(
        `${server}/order/update-order-status/${id}`, // Gửi request đến server
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        // Nếu thành công
        toast.success("Thành công!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        // Nếu thất bại
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    // Cập nhật trạng thái đơn hàng hoàn trả
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`, // Gửi request đến server
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Thành công!");
        dispatch(getAllOrdersOfShop(seller._id)); // Lấy tất cả đơn hàng của shop
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Chi tiết đơn đặt hàng</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Trở về
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Đặt ngày: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <br />
      <br />
      {data &&
        data?.cart.map((item) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${item.images[0]?.url}`}
              alt=""
              className="w-[80x] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                {item.sellPrice?.toLocaleString("vi-VN") ||
                  item.discountPrice?.toLocaleString("vi-VN")}{" "}
                đ x {item.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Thành tiền:{" "}
          <strong>
            {data?.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Địa chỉ giao hàng:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Thanh toán?</h4>
          <h4>
            Trạng thái:{" "}
            {data?.paymentInfo?.status
              ? data?.paymentInfo?.status
              : "Chưa thanh toán"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Trạng thái đơn hàng:</h4>
      {data?.status !== "Đang yêu cầu hoàn trả" &&
        data?.status !== "Đã hoàn trả" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
          >
            {[
              "Đang chờ xác nhận",
              "Đã bàn giao đơn vị vận chuyển",
              "Đang giao hàng",
              "Đã nhận tại cửa hàng",
              "Đang giao tới bạn",
              "Đã giao hàng",
            ]
              .slice(
                [
                  "Đang chờ xác nhận",
                  "Đã bàn giao đơn vị vận chuyển",
                  "Đang giao hàng",
                  "Đã nhận tại cửa hàng",
                  "Đang giao tới bạn",
                  "Đã giao hàng",
                ].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}
      {data?.status === "Đang yêu cầu hoàn trả" ||
      data?.status === "Đã hoàn trả" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Đang yêu cầu hoàn trả", "Đã hoàn trả"]
            .slice(
              ["Đang yêu cầu hoàn trả", "Đã hoàn trả"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <div
        className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
        onClick={
          data?.status !== "Đang yêu cầu hoàn trả"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Cập nhật
      </div>
    </div>
  );
};

export default OrderDetails;
