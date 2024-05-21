import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Rating from "@mui/material/Rating";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [displayCount, setDisplayCount] = useState(5);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(getAllProductsShop(data && data?.shop._id)); // Lấy tất cả sản phẩm của cửa hàng
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      // Kiểm tra sản phẩm đã tồn tại trong danh sách yêu thích chưa
      setClick(true);
    } else {
      // Nếu chưa tồn tại thì setClick(false)
      setClick(false);
    }
  }, [data, dispatch, wishlist]);

  const handleShowMoreClick = () => {
    // Xem thêm mô tả sản phẩm
    setShowFullDescription(true);
  };

  const handleShowLessClick = () => {
    // Thu gọn mô tả sản phẩm
    setShowFullDescription(false);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    // Xóa sản phẩm khỏi danh sách yêu thích
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    // Thêm sản phẩm vào danh sách yêu thích
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (data) => {
    // Thêm sản phẩm vào giỏ hàng
    // const isItemExists = cart && cart.find((i) => i._id === id);
    // if (isItemExists) {
    //   toast.error("Sản phẩm đã tồn tại trong giỏ hàng!");
    // } else {
    //   if (data.stock < 1) {
    //     // Kiểm tra số lượng tồn kho
    //     toast.error("Sản phẩm đã hết!");
    //   } else {

    dispatch(addTocart(data));
    toast.success("Thêm thành công!");
    // }
    // }
  };
  const useStyles = makeStyles((theme) => ({
    // CSS cho button
    button: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    icon: {
      marginLeft: theme.spacing(1),
    },
  }));

  // Trong component của bạn
  const classes = useStyles();

  const totalReviewsLength = // Tính tổng số lượng đánh giá
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0); // Tính tổng số lượng đánh giá

  const totalRatings = // Tính tổng số lượng đánh giá
    products &&
    products.reduce(
      (
        acc,
        product // Tính tổng số lượng đánh giá
      ) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), // Tính tổng số lượng đánh giá
      0
    );

  const avg = totalRatings / totalReviewsLength || 0; // Tính trung bình đánh giá

  const averageRating = avg.toFixed(2); // Làm tròn đánh giá

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

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt=""
                  className="w-[80%]"
                  style={{ objectFit: "contain" }}
                />
                <div className="w-full flex justify-center pr-5">
                  {data &&
                    data.images.slice(0, displayCount).map((i, index) => (
                      <div
                        className={`${select === 0 ? "border" : "null"
                          } cursor-pointer`}
                        key={index}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  {data && data.images.length > displayCount && (
                    <button onClick={() => setDisplayCount(displayCount + 5)}>
                      Xem thêm
                    </button>
                  )}
                  <div
                    className={`${select === 1 ? "border" : "null"
                      } cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.brandTitle}`}>
                  Thương hiệu: {data.brand}
                </h1>
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <div className="flex pt-3 p-3 relative">
                  <h3 className={`${styles.price} pr-10 relative`}>
                    {data.sellPrice && (
                      <>
                        {data.sellPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}{" "}
                        / {data.unit}
                      </>
                    )}

                    {data.discountPrice && (
                      <>
                        {data.discountPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}{" "}
                        / {data.unit}
                      </>
                    )}

                    {data.sellPrice === undefined && (
                      <h3 className="font-[800] text-[25px] text-[#ff5837] absolute top-0 right-0 text-sm">
                        -{data.percentDiscount}(%)
                      </h3>
                    )}
                  </h3>
                </div>

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
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <Button variant="contained" className={classes.button}>
                    Thêm sản phẩm
                  </Button>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={decrementCount}
                      style={{ marginRight: "10px" }}
                    >
                      -
                    </Button>
                    <Typography
                      variant="body1"
                      style={{
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                        margin: "0 10px",
                      }}
                    >
                      {count}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={incrementCount}
                    >
                      +
                    </Button>
                  </Box>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Xóa sản phẩm yêu thích"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Thêm sản phẩm yêu thích"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  {/* <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link> */}
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Đánh giá
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Gửi tin nhắn <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: "#f5f6fb", px: 3, py: 2, borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: 1,
          pt: 10,
          pb: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              cursor: "pointer",
              textDecoration: active === 1 ? "underline" : "none", // Giữ gạch chân khi active
              "&:hover": {
                color: theme.palette.primary.main, // Thay đổi màu sắc khi hover
                textDecoration: "underline", // Thêm gạch chân khi hover
              },
            }}
            onClick={() => setActive(1)}
          >
            <Typography variant="h5">Thông tin sản phẩm</Typography>
          </Box>
          {active === 1 && <Box sx={{ ...styles.active_indicator }} />}
        </Box>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              cursor: "pointer",
              textDecoration: active === 2 ? "underline" : "none", // Giữ gạch chân khi active
              "&:hover": {
                color: theme.palette.primary.main, // Thay đổi màu sắc khi hover
                textDecoration: "underline", // Thêm gạch chân khi hover
              },
            }}
            onClick={() => setActive(2)}
          >
            <Typography variant="h5">Đánh giá sản phẩm</Typography>
          </Box>
          {active === 2 && <Box sx={{ ...styles.active_indicator }} />}
        </Box>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              cursor: "pointer",
              textDecoration: active === 3 ? "underline" : "none", // Giữ gạch chân khi active
              "&:hover": {
                color: theme.palette.primary.main, // Thay đổi màu sắc khi hover
                textDecoration: "underline", // Thêm gạch chân khi hover
              },
            }}
            onClick={() => setActive(3)}
          >
            <Typography variant="h5">Thông tin cửa hàng</Typography>
          </Box>
          {active === 3 && <Box sx={{ ...styles.active_indicator }} />}
        </Box>
      </Box>
      {active === 1 && (
        <Typography
          variant="body1"
          sx={{ py: 2, pb: 10, whiteSpace: "pre-line" }}
        >
          {data?.description}
        </Typography>
      )}
      {active === 2 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // changed from "center" to "flex-start"
            py: 3,
            overflowY: "scroll",
          }}
        >
          {data?.reviews?.map((item) => (
            <Box sx={{ display: "flex", my: 2 }}>
              <Avatar src={item.user?.avatar?.url} />
              <Box sx={{ pl: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ mr: 3 }}>
                    {item.user.name}
                  </Typography>
                  <Rating value={data?.ratings} readOnly />
                </Box>
                <Typography>{item.comment}</Typography>
              </Box>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {data?.reviews?.length === 0 && (
              <Typography>Chưa có đánh giá nào!</Typography>
            )}
          </Box>
        </Box>
      )}
      {active === 3 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            p: 5,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Link to={`/shop/preview/${data.shop._id}`}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={data?.shop?.avatar?.url} />
                <Box sx={{ pl: 3 }}>
                  <Typography variant="h6" sx={{ ...styles.shop_name }}>
                    {data.shop.name}
                  </Typography>
                  <Typography variant="body2">
                    ({averageRating}/5) Đánh giá
                  </Typography>
                </Box>
              </Box>
            </Link>
            <Typography variant="body1" sx={{ pt: 2 }}>
              {data.shop.description}
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              mt: { xs: 5, md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h6" sx={{ pt: 3 }}>
                Sản phẩm cửa hàng:{" "}
                <Typography variant="body1" component="span">
                  {products && products.length}
                </Typography>
              </Typography>
              <Typography variant="h6" sx={{ pt: 3 }}>
                Đánh giá:{" "}
                <Typography variant="body1" component="span">
                  {totalReviewsLength}
                </Typography>
              </Typography>
              <Link to={`/shop/preview/${data?.shop._id}`}>
                <Button variant="contained" sx={{ mt: 3 }}>
                  Xem cửa hàng
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;
