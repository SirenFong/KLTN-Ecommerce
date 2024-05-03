import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from "@mui/material";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Thành công!");
      // Refresh orders after update
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const refundOrderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Thành công!");
      // Refresh orders after update
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <BsFillBagFill size={30} color="crimson" />
          <Typography variant="h5" style={{ marginLeft: "10px" }}>
            Chi tiết đơn đặt hàng
          </Typography>
        </div>
        <Link to="/dashboard-orders" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            style={{
              backgroundColor: "#fce1e6",
              color: "#e94560",
              fontWeight: "600",
            }}
          >
            Trở về
          </Button>
        </Link>

        <Grid container spacing={2} style={{ marginTop: "5px" }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              Đặt ngày: <span>{data?.createdAt?.slice(0, 10)}</span>
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: "5px" }}>
          {data &&
            data?.cart.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Grid container alignItems="center">
                  <Grid item>
                    <img
                      src={`${item.images[0]?.url}`}
                      alt=""
                      style={{ width: "80px", height: "80px" }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" style={{ paddingLeft: "10px" }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ paddingLeft: "10px", color: "#00000091" }}
                    >
                      {item.sellPrice?.toLocaleString("vi-VN") ||
                        item.discountPrice?.toLocaleString("vi-VN")}{" "}
                      đ x {item.qty}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Thành tiền:{" "}
          <strong>
            {data?.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </strong>
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "5px" }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Địa chỉ giao hàng:</Typography>
            <Typography variant="subtitle1">{data?.user.name}</Typography>
            <Typography variant="subtitle1">
              {data?.shippingAddress.address1 +
                " " +
                data?.shippingAddress.address2}
            </Typography>

            {/* <Typography variant="subtitle1">
              {data?.shippingAddress.country}
            </Typography> */}
            <Typography variant="subtitle1">
              {data?.shippingAddress.city}
            </Typography>
            <Typography variant="subtitle1">
              {data?.user?.phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Thanh toán:</Typography>
            <Typography variant="subtitle1">
              {data?.paymentInfo?.status
                ? data?.paymentInfo?.status
                : "Chưa thanh toán"}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ marginTop: "20px" }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Trạng thái đơn hàng</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Trạng thái đơn hàng"
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
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Button
          variant="contained"
          style={{
            backgroundColor: "#FCE1E6",
            color: "#E94560",
            fontWeight: "600",
            marginTop: "20px",
          }}
          onClick={
            data?.status !== "Đang yêu cầu hoàn trả"
              ? orderUpdateHandler
              : refundOrderUpdateHandler
          }
        >
          Cập nhật
        </Button>
      </Paper>
    </Box>
  );
};

export default OrderDetails;
