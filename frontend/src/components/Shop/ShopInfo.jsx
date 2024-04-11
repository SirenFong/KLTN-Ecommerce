import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id)); // Lấy tất cả sản phẩm của shop
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`) // Gửi request đến server
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    // Đăng xuất
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  const totalReviewsLength = // Tính tổng số lượng đánh giá
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0); // Tính tổng số lượng đánh giá

  const totalRatings = // Tính tổng số lượng đánh giá
    products && // Tính tổng số lượng đánh giá
    products.reduce(
      // Tính tổng số lượng đánh giá
      (
        acc,
        product // Tính tổng số lượng đánh giá
      ) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), // Tính tổng số lượng đánh giá
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0; // Tính trung bình đánh giá

  return (
    <>
      {isLoading ? (
        <Loader /> // Hiển thị loader
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={`${data.avatar?.url}`} // Hiển thị ảnh đại diện
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data.description}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Địa chỉ cửa hàng</h5>
            <h4 className="text-[#000000a6]">{data.address}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Hotline</h5>
            <h4 className="text-[#000000a6]">0{data.phoneNumber}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Số lượng sản phẩm</h5>
            <h4 className="text-[#000000a6]">{products && products.length}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Đánh giá sản phẩm</h5>
            <h4 className="text-[#000000b0]">{averageRating}/5</h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Chỉnh sửa</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}
              >
                <span className="text-white">Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
