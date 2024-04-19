import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
// import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id)); // Lấy tất cả đơn hàng của user
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id); // Lấy đơn hàng theo id
  const reviewHandler = async (e) => {
    // Hàm đánh giá
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    // Hàm yêu cầu hoàn trả
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        // Gửi request yêu cầu hoàn trả
        status: "Đang yêu cầu hoàn trả",
      })
      .then((res) => {
        // Nếu thành công
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id)); // Lấy lại tất cả đơn hàng của user
      })
      .catch((error) => {
        toast.error(error.response.data.message); // Nếu lỗi thì hiển thị thông báo lỗi
      });
  };

  return (
    <Box py={4} minHeight="100vh" className={styles.section}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Box display="flex" alignItems="center">
            <BsFillBagFill size={30} color="crimson" />
            <Typography variant="h4" className="pl-2">
              Chi tiết đơn hàng
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            color="secondary"
          >
            Trở về
          </Button>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center" pt={6}>
        <Grid item>
          <Typography variant="body1">
            Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Đặt ngày: <span>{data?.createdAt?.slice(0, 10)}</span>
          </Typography>
        </Grid>
      </Grid>

      {/* order items */}
      <Box pt={4}>
        {data &&
          data?.cart.map((item) => {
            return (
              <Grid container alignItems="start" mb={5}>
                <Grid item className="p-5">
                  <img
                    src={`${item.images[0]?.url}`}
                    alt=""
                    className="w-[80x] h-[80px] "
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" className="pl-3">
                    {item.name}
                  </Typography>
                  <Typography variant="h5" className="pl-3 text-[#00000091]">
                    {item.sellPrice?.toLocaleString("vi-VN") ||
                      item.discountPrice?.toLocaleString("vi-VN")}{" "}
                    đ x {item.qty}
                  </Typography>
                </Grid>
                {!item.isReviewed && data?.status === "Đã giao hàng" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpen(true) || setSelectedItem(item)}
                    >
                      Đánh giá
                    </Button>
                  </Grid>
                )}
              </Grid>
            );
          })}
      </Box>

      {/* Bảng Review */}
      {open && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="fixed"
          top={0}
          left={0}
          height="100vh"
          // bgcolor="#0005"
          zIndex="tooltip"
        >
          <Box width="50%" bgcolor="#fff" boxShadow={3} borderRadius={2} p={3}>
            <Grid container justifyContent="flex-end" p={3}>
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </Grid>
            <Typography variant="h3" align="center">
              Đánh giá
            </Typography>
            <Box pt={4} display="flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <Box pl={3}>
                <Typography variant="h5">{selectedItem?.name}</Typography>
                <Typography variant="h5">
                  {selectedItem?.sellPrice.toLocaleString("vi-VN")}đ x{" "}
                  {selectedItem?.qty}
                </Typography>
              </Box>
            </Box>

            <Box pt={4}>
              <Typography variant="h5">
                Chọn đánh giá <span className="text-red-500">*</span>
              </Typography>
              <Box pt={1}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Box>
              <Box pt={2}>
                <TextField
                  name="comment"
                  multiline
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Để lại đánh giá sản phẩm!"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box pt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={rating > 0 ? reviewHandler : null}
                >
                  Gửi
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box borderTop={1} borderColor="divider" className="w-full text-right">
        <Typography variant="h6" pt={3}>
          Thành tiền:{" "}
          <strong>
            {data?.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </strong>
        </Typography>
      </Box>
      <br />
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Địa chỉ giao hàng:</Typography>
          <Typography variant="body1">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </Typography>
          <Typography variant="body1">
            {data?.shippingAddress.country}
          </Typography>
          <Typography variant="body1">{data?.shippingAddress.city}</Typography>
          <Typography variant="body1">0{data?.user?.phoneNumber}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Trạng thái thanh toán:</Typography>
          <Typography variant="body1">
            Trạng thái đơn hàng:{" "}
            {data?.paymentInfo?.status
              ? data?.paymentInfo?.status
              : "Chưa thanh toán"}
          </Typography>
          <br />
          {data?.status === "Đã giao hàng" && (
            <Button variant="contained" color="primary" onClick={refundHandler}>
              Yêu cầu hoàn trả
            </Button>
          )}
        </Grid>
      </Grid>
      <br />
      <Link to="/">
        <Button variant="contained" color="primary">
          Nhắn tin
        </Button>
      </Link>
      <br />
      <br />
    </Box>
  );
};

export default UserOrderDetails;
