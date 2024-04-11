import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams(); // Lấy id từ url

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id)); // Lấy tất cả đơn hàng của user
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id); // Tìm đơn hàng theo id

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {" "}
      <>
        {data && data?.status === "Processing" ? (
          <h1 className="text-[20px]">Đơn hàng đang được tiếp nhận.</h1>
        ) : data?.status === "Transferred to delivery partner" ? (
          <h1 className="text-[20px]">
            Đơn hàng đã bàn giao cho đơn vị vận chuyển
          </h1>
        ) : data?.status === "Shipping" ? (
          <h1 className="text-[20px]">Đơn hàng được được vận chuyển</h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px]">
            Đơn hàng đã được tiếp nhận tại kho hàng
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px]">Đơn hàng đang được giao tới</h1>
        ) : data?.status === "Delivered" ? (
          <h1 className="text-[20px]">Đơn hàng đã giao thành công!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px]">
            Đơn yêu cầu hoàn trả đang chờ tiếp nhận!
          </h1>
        ) : data?.status === "Refund Success" ? (
          <h1 className="text-[20px]">Đơn hoàn trả thành công!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
