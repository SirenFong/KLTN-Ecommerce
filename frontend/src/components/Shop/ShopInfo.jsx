import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../server";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: "auto",
    display: "block",
    marginTop: theme.spacing(2),
  },
  profile: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "auto",
  },
  name: {
    marginTop: theme.spacing(1),
  },
  description: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  info: {
    padding: theme.spacing(2),
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    width: "150px",
  },
  link: {
    textDecoration: "none",
  },
}));

const ShopInfo = ({ isOwner }) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const totalReviewsLength = products
    ? products.reduce((acc, product) => acc + product.reviews.length, 0)
    : 0;
  const totalRatings = products
    ? products.reduce(
        (acc, product) =>
          acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
        0
      )
    : 0;
  const averageRating = totalReviewsLength
    ? totalRatings / totalReviewsLength
    : 0;

  return (
    <>
      {isLoading ? (
        <CircularProgress className={classes.loader} />
      ) : (
        <div>
          <div className={classes.profile}>
            <Avatar src={data.avatar?.url} alt="" className={classes.avatar} />
            <Typography variant="h5" className={classes.name}>
              {data.name}
            </Typography>
            <Typography variant="body1" className={classes.description}>
              {data.description}
            </Typography>
          </div>
          <Divider />
          <div className={classes.info}>
            <Typography variant="h6" className={classes.subtitle}>
              Địa chỉ cửa hàng
            </Typography>
            <Typography variant="body1">{data.address}</Typography>
          </div>
          <Divider />
          <div className={classes.info}>
            <Typography variant="h6" className={classes.subtitle}>
              Hotline
            </Typography>
            <Typography variant="body1">0{data.phoneNumber}</Typography>
          </div>
          <Divider />
          <div className={classes.info}>
            <Typography variant="h6" className={classes.subtitle}>
              Số lượng sản phẩm
            </Typography>
            <Typography variant="body1">
              {products ? products.length : 0}
            </Typography>
          </div>
          <Divider />
          <div className={classes.info}>
            <Typography variant="h6" className={classes.subtitle}>
              Đánh giá trung bình
            </Typography>
            <Typography variant="body1">
              {averageRating.toFixed(1)}/5
            </Typography>
          </div>
          {isOwner && (
            <div className={classes.buttonsContainer}>
              <Link to="/settings" className={classes.link}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Chỉnh sửa
                </Button>
              </Link>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={logoutHandler}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
