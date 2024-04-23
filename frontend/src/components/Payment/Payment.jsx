import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user); //Lấy thông tin user từ redux
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder")); //Lấy dữ liệu order từ localStorage
    setOrderData(orderData); //Set dữ liệu order vào state
  }, []);

  //Sử dụng https://app.exchangerate-api.com/keys để lấy mã chuyển đổi tiền tệ
  const convertToSupportedCurrency = async (amount) => {
    try {
      // Bắt lỗi
      const response = await axios.get(
        // Gọi api để lấy mã chuyển đổi tiền tệ
        "https://api.exchangerate-api.com/v4/latest/VND", //Gọi api để lấy mã chuyển đổi tiền tệ
        { headers: { Authorization: "Bearer 1f4090abbfa4c92e4078bb61" } } //Call api để lấy mã chuyển đổi tiền tệ
      );
      const exchangeRate = response.data.rates.USD; //Lấy mã chuyển đổi tiền tệ
      const amountInUSD = amount * exchangeRate; //Chuyển đổi tiền VND sang USD
      return amountInUSD; //Trả về số tiền đã chuyển đổi
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return amount; //Trả về số tiền ban đầu nếu không lấy được mã chuyển đổi
    }
  };

  const createOrder = async (data, actions) => {
    const amountInUSD = await convertToSupportedCurrency(orderData?.totalPrice); //Chuyển đổi tiền VND sang USD
    return actions.order
      .create({
        //Tạo order
        purchase_units: [
          {
            description: "Sunflower", //Mô tả sản phẩm
            amount: {
              currency_code: "USD", //Chuyển đổi sang USD
              value: amountInUSD,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING", //Không cần địa chỉ giao hàng
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
    discountPercentenge: orderData?.discountPercentenge,
  };

  const onApprove = async (data, actions) => {
    //Xử lý thanh toán
    return actions.order.capture().then(function (details) {
      //Lấy thông tin thanh toán
      const { payer } = details;
      //Kiểm tra xem thông tin thanh toán có tồn tại không
      let paymentInfo = payer;
      //Nếu tồn tại thì gọi hàm paypalPaymentHandler
      if (paymentInfo !== undefined) {
        //Gọi hàm paypalPaymentHandler
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    //Hàm xử lý thanh toán Paypal
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Gán thông tin thanh toán vào order
    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "Thành công",
      type: "Paypal",
    };

    await axios
      //Gửi request tới server để tạo order
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Thanh toán thành công!");
        //Lưu thông tin giỏ hàng và order vào localStorage
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  //Dữ liệu thanh toán  
  const paymentData = {
    //Số tiền cần thanh toán
    amount: Math.round(orderData?.totalPrice * 100), //Chuyển đổi tiền VND sang cent
  };

  //Hàm xử lý thanh toán
  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      //Gán thông tin thanh toán vào order
      order.paymentInfo = {
        type: "Cash by Payment",
      };
      //Gửi request tới server để tạo order
      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      //Kiểm tra xem stripe và elements có tồn tại không
      const client_secret = data.client_secret;
      if (!stripe || !elements) return;

      //Gọi hàm confirmCardPayment để xác nhận thanh toán
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymnentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Thanh toán thành công!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Thanh toán thành công!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* button chọn */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Thanh toán với thẻ tín dụng
          </h4>
        </div>

        {/* thanh toán với thẻ tín dụng */}
        {select === 1 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Tên chủ thẻ</label>
                  <input
                    required
                    placeholder={user && user.name}
                    className={`${styles.input} !w-[95%] text-[#444]`}
                    value={user && user.name}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Ngày hết hạn</label>
                  <CardExpiryElement
                    className={`${styles.input}`}
                    options={{
                      style: {
                        base: {
                          fontSize: "19px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Mã thẻ</label>
                  <CardNumberElement
                    className={`${styles.input} !h-[35px] !w-[95%]`}
                    options={{
                      style: {
                        base: {
                          fontSize: "19px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">CVV</label>
                  <CardCvcElement
                    className={`${styles.input} !h-[35px]`}
                    options={{
                      style: {
                        base: {
                          fontSize: "19px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <input
                type="submit"
                value="Xác nhận"
                className={`${styles.button} !bg-[#3c80ce] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>

      <br />

      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Thanh toán với Paypal
          </h4>
        </div>

        {/* Thanh toán với Paypal */}
        {select === 2 ? (
          <div className="w-full flex border-b">
            <div
              className={`${styles.button} !bg-[#3c80ce] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              onClick={() => setOpen(true)}
            >
              Thanh toán
            </div>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
                  <div className="w-full flex justify-end p-3">
                    <RxCross1
                      size={30}
                      className="cursor-pointer absolute top-3 right-3"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AV4FzNuU1gi3eQJ2FYZNVhst663uyq51RJk9Kh7_7DMq7LOTV_n0q6d1Mb4aRusepml9v-OvCZyNzsJV",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      // currency="VNĐ"
                      onApprove={onApprove}
                      createOrder={createOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <br />

      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(3)}
          >
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Thanh toán khi nhận hàng
          </h4>
        </div>
        {select === 3 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Xác nhận"
                className={`${styles.button} !bg-[#3c80ce] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  // const shipping = orderData?.shipping?.toFixed(0);
  const formatCurrency = (value) => {
    if (!value) return "-";
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(value).replace(/\D00(?=\D*$)/, "");
  };
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng tiền:</h3>
        <h5 className="text-[18px] font-[600]">
          {formatCurrency(orderData?.subTotalPrice)}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Phí giao hàng:
        </h3>
        <h5 className="text-[18px] font-[600]">
          {formatCurrency(orderData?.shipping)}
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Giảm giá:</h3>
        <h5 className="text-[18px] font-[600]">
          {formatCurrency(orderData?.discountPercentenge)}
        </h5>
      </div>
      <h3 className="text-[16px] font-[400] text-[#000000a4]">Thành tiền</h3>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        {formatCurrency(orderData?.totalPrice)}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
