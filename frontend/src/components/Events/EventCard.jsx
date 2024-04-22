import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    width: "100%",
    height: "auto",
    margin: "1rem",
    "&:hover": {
      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
      transform: "scale(1.05)",
      transition: "all 0.3s",
    },
  },
  media: {
    height: 140,
  },
});

const EventCard = ({ active, data }) => {
  const classes = useStyles();
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = useCallback(
    (data) => {
      const isItemExists = cart?.some((i) => i._id === data._id);
      if (isItemExists) {
        toast.error("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        if (data.stock < 1) {
          toast.error("Số lượng sản phẩm đã hết!");
        } else {
          const cartData = { ...data, qty: 1 };
          dispatch(addTocart(cartData));
          toast.success("Thêm vào giỏ hàng thành công!");
        }
      }
    },
    [cart, dispatch]
  );

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={data.images[0]?.url}
        title={data.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {data.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {data.description.length > 200
            ? `${data.description.substring(0, 200)}...`
            : data.description}
        </Typography>
        <CountDown data={data} />
        <Button
          className="pt-2"
          variant="contained"
          color="primary"
          component={Link}
          to={`/product/${data._id}?isEvent=true`} // Add link to the product
          style={{ marginRight: "10px" }}
        >
          Xem chi tiết
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => addToCartHandler(data)}
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
