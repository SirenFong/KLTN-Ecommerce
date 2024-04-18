import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";

const AllOrders = () => {
  const { orders: ordersFromRedux } = useSelector((state) => state.order); // get orders from redux
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState(ordersFromRedux);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOrders(ordersFromRedux); // set orders from redux to local state
  }, [ordersFromRedux]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllOrdersOfShop(seller._id))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));

    const interval = setInterval(() => {
      dispatch(getAllOrdersOfShop(seller._id));
    }, 5000); //Lấy danh sách đơn hàng mỗi 5s

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, seller._id]);

  if (isLoading) {
    //Nếu đang loading
    return <Loader />; //Nếu đang loading thì hiển thị loader
  }

  const columns = [
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã giao hàng"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Số lượng sản phẩm",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng tiền",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      console.log(item.user);
      row.push({
        id: item._id,
        phoneNumber: item.user ? `${item.user.phoneNumber}` : "N/A",
        itemsQty: item.cart.length,
        total: item.totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Tạo đơn hàng</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {/* {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Tạo mới
                </h5>
              </div>
            </div>
          )} */}
        </div>
      )}
    </>
  );
};

export default AllOrders;
