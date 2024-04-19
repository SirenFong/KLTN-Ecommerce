import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { Box, Typography, Fade, Button } from "@material-ui/core";

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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      width="100%"
    >
      {data && (
        <Fade in={true} timeout={500}>
          <Typography variant="h4">
            {data.status === "Đang chờ xác nhận" &&
              "Đơn hàng đang được tiếp nhận."}
            {data.status === "Đã bàn giao đơn vị vận chuyển" &&
              "Đơn hàng đã bàn giao cho đơn vị vận chuyển"}
            {data.status === "Đang giao tới bạn" &&
              "Đơn hàng được được vận chuyển"}
            {data.status === "Đã nhận tại cửa hàng" &&
              "Đơn hàng đã được tiếp nhận tại kho hàng"}
            {data.status === "Đang giao tới bạn" &&
              "Đơn hàng đang được giao tới"}
            {data.status === "Đã giao hàng" && "Đơn hàng đã giao thành công!"}
            {data.status === "Đang yêu cầu hoàn trả" &&
              "Đơn yêu cầu hoàn trả đang chờ tiếp nhận!"}
            {data.status === "Đã hoàn trả" && "Đơn hoàn trả thành công!"}
          </Typography>
        </Fade>
      )}
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/profile"
        >
          Trở về
        </Button>
      </Box>
    </Box>
  );
};

export default TrackOrder;
