import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { Button, Typography, Grid, Avatar, Box } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat(); // Lấy tất cả đánh giá

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Button
            color={active === 1 ? "primary" : "default"}
            onClick={() => setActive(1)}
          >
            <Typography variant="h5">Sản phẩm</Typography>
          </Button>
          <Button
            color={active === 2 ? "primary" : "default"}
            onClick={() => setActive(2)}
          >
            <Typography variant="h5">Sự kiện</Typography>
          </Button>
          <Button
            color={active === 3 ? "primary" : "default"}
            onClick={() => setActive(3)}
          >
            <Typography variant="h5">Đánh giá</Typography>
          </Button>
        </Grid>
        <Grid item>
          {isOwner && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard"
            >
              <Typography variant="h9">Trang quản lý</Typography>
            </Button>
          )}
        </Grid>
      </Grid>

      <br />
      {active === 1 && (
        <Grid container spacing={2}>
          {products &&
            products.map((i, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ProductCard data={i} isShop={true} />
              </Grid>
            ))}
        </Grid>
      )}

      {active === 2 && (
        <Box>
          <Grid container spacing={2}>
            {events &&
              events.map((i, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ProductCard data={i} isShop={true} isEvent={true} />
                </Grid>
              ))}
          </Grid>
          {events && events.length === 0 && (
            <Typography align="center" py={5} variant="h5">
              Hiện tại chưa có sự kiện nào!
            </Typography>
          )}
        </Box>
      )}

      {active === 3 && (
        <Box>
          {allReviews &&
            allReviews.map((item, index) => (
              <Box display="flex" my={2} key={index}>
                <Avatar src={`${item.user.avatar?.url}`} alt="" />
                <Box pl={2}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" pr={2}>
                      {item.user.name}
                    </Typography>
                    <Ratings rating={item.rating} />
                  </Box>
                  <Typography variant="body1" color="textSecondary">
                    {item?.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {item?.comment}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item?.createdAt.slice(0, 10)}
                  </Typography>
                </Box>
              </Box>
            ))}
          {allReviews && allReviews.length === 0 && (
            <Typography align="center" py={5} variant="h5">
              Chưa có đánh giá sản phẩm!
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ShopProfileData;
