import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { Button, Select } from "@material-ui/core";

const Checkout = () => {
  const { user } = useSelector((state) => state.user); // Lấy thông tin người dùng
  const { cart } = useSelector((state) => state.cart); // Lấy giỏ hàng

  //
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [coupons, setCoupons] = useState([]);
  const [coupouns, setCoupouns] = useState([]);
  const [row, setRow] = useState([]);
  //

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  // const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCountry("VN");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    // Submit payment
    if (
      // Kiểm tra thông tin địa chỉ
      address1 === "" ||
      address2 === "" ||
      // zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Vui lòng nhập địa chỉ nhận hàng!");
    } else {
      // Nếu thông tin địa chỉ hợp lệ
      const shippingAddress = {
        address1,
        address2,
        // zipCode,
        country,
        city,
      };

      const orderData = {
        //  Dữ liệu đơn hàng
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        sellPrice,
        shippingAddress,
        user,
      };

      //Lưu giỏ hàng lên localStorage
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý mã giảm giá
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const coupon = res.data.couponCode;
      if (!coupon) {
        toast.error("Mã giảm giá không tồn tại!");
        return;
      }

      // Kiểm tra số lượng mã giảm giá đã chọn, chỉ cho phép tối đa 2 mã
      if (selectedCoupons.length >= 2) {
        toast.error("Chỉ được áp dụng tối đa 2 mã giảm giá!");
        return;
      }

      // Kiểm tra xem mã giảm giá đã được áp dụng cho mục trong giỏ hàng chưa
      const isCouponApplicable = cart.some(
        (item) => item.shopId === coupon.shopId
      );
      if (!isCouponApplicable) {
        toast.error("Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng!");
        return;
      }

      // Kiểm tra xem mã giảm giá đã được chọn trước đó chưa
      const isCouponSelected = selectedCoupons.some(
        (selectedCoupon) => selectedCoupon._id === coupon._id
      );
      if (isCouponSelected) {
        toast.error("Mã giảm giá đã được chọn trước đó!");
        return;
      }

      // Kiểm tra minAmount của mã giảm giá
      if (subTotalPrice < coupon.minAmount) {
        toast.error("Chưa đủ tiền để áp mã giảm giá này!");
        return;
      }

      // Tính toán số tiền giảm giá dựa trên phần trăm giảm
      let discountAmount = (coupon.value / 100) * subTotalPrice;

      // Nếu số tiền giảm vượt quá maxAmount của mã giảm giá, chỉ lấy maxAmount
      if (discountAmount > coupon.maxAmount) {
        discountAmount = coupon.maxAmount;
      }

      // Thêm mã giảm giá vào danh sách đã chọn
      setSelectedCoupons([
        ...selectedCoupons,
        { ...coupon, actualDiscount: discountAmount },
      ]);
      setCouponCode("");

      // Cập nhật couponCodeData
      setCouponCodeData({ ...coupon, actualDiscount: discountAmount });
    });
  };

  useEffect(() => {
    // Lấy danh sách mã giảm giá
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-all-coupons`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const columns = [
    // Cột bảng mã giảm giá
    { field: "name", headerName: "Mã giảm giá", flex: 2 },
    { field: "price", headerName: "Giảm giá (%)", flex: 1 },
  ];

  useEffect(() => {
    const newRow = coupouns.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.value + " %",
    }));
    setRow(newRow);
  }, [coupouns]);

  // Tính tổng giá tiền của giỏ hàng
  const subTotalPrice = cart.reduce((acc, item) => {
    return acc + (item.qty * item.sellPrice || item.qty * item.discountPrice);
  }, 0);

  const shipping = subTotalPrice > 500000 ? 0 : 15000;

  const discountPercentenge =
    couponCodeData && subTotalPrice !== null
      ? (subTotalPrice * couponCodeData.value) / 100
      : 0;

  // Tính tổng giá tiền sau khi áp dụng mã giảm giá
  const totalDiscount = selectedCoupons.reduce((acc, coupon) => {
    return acc + (subTotalPrice * coupon.value) / 100;
  }, 0);
  const totalPrice = (subTotalPrice + shipping - totalDiscount).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            open={open}
            setOpen={setOpen}
            coupouns={coupouns}
          />

          <>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="w-full mt-5 bg-white">
                <DataGrid
                  rows={row}
                  columns={columns}
                  pageSize={2}
                  disableSelectionOnClick
                  autoHeight
                />
                {open && (
                  <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center"></div>
                )}
              </div>
            )}
          </>
        </div>
      </div>
      <div className={"w-[150px] 800px:w-[280px]"} onClick={paymentSubmit}>
        <Button color="primary" variant="contained">
          Hoàn tất
        </Button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  // Thông tin giao hàng
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  // zipCode,
  // setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Thông tin người nhận</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Họ và tên</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Địa chỉ Email</label>
            <input
              type="email"
              value={user && user.email}
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Số điện thoại</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
        </div>
        <br />
        <h5 className="text-[18px] font-[500]">Địa chỉ giao hàng</h5>
        <br />
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Chọn Tỉnh/Thành Phố
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <Select
              placeholder="Chọn Tỉnh/Thành Phố"
              color="primary"
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Nhập địa chỉ nhà</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Nhập Quận/Huyện</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Địa chỉ đã lưu
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-1">
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    // setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  // Thông tin giỏ hàng
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng tiền:</h3>
        <h5 className="text-[18px] font-[600]">
          {subTotalPrice.toLocaleString("vi-VN")} VNĐ
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Phí giao hàng:
        </h3>
        <h5 className="text-[18px] font-[600]">
          {shipping.toLocaleString("vi-VN")} VNĐ
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Mã giảm giá:
        </h3>
        <h5 className="text-[18px] font-[600]">
          -{" "}
          {discountPercentenge
            ? discountPercentenge.toLocaleString("vi-VN") + " VNĐ"
            : null}
        </h5>
      </div>

      <h5 className="text-[18px] font-[600] text-end pt-3">
        {Math.round(totalPrice).toLocaleString("vi-VN")} VNĐ
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Mã giảm giá"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />

        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Áp mã giảm giá"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
