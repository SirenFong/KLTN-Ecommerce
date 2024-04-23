import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";

const useStyles = makeStyles((theme) => ({
  dashboardItem: {
    marginBottom: theme.spacing(4),
    width: "30%",
    minHeight: "20vh",
    backgroundColor: "#fff",
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardItemTitle: {
    fontSize: "18px",
    fontWeight: 400,
    color: "#00000085",
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  dashboardItemContent: {
    fontSize: "22px",
    fontWeight: 500,
    color: "#000000",
  },
  link: {
    color: "#077f9c",
    textDecoration: "none",
    paddingTop: theme.spacing(2),
  },
  dataGridContainer: {
    width: "100%",
    minHeight: "45vh",
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
  },
}));

const AdminDashboardMain = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning =
    adminOrders && adminOrders.reduce((acc, item) => acc + item.totalPrice, 0);
  const adminBalance = adminEarning?.toFixed(0);
  const adminBalanceInVND = Number(adminBalance)?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const columns = [
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Đã giao hàng"
          ? "greenColor"
          : "redColor",
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
      headerName: "Tổng cộng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Ngày đặt hàng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const rows = adminOrders
    ? adminOrders.map((item) => ({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice.toLocaleString() + " VNĐ",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      }))
    : [];

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
          <div className="w-full block 800px:flex items-center justify-between">
            <div className={classes.dashboardItem}>
              <div className={classes.dashboardItemTitle}>
                <AiOutlineMoneyCollect size={30} className="mr-2" />
                <span>Tổng thu nhập</span>
              </div>
              <div className={classes.dashboardItemContent}>
                {adminBalanceInVND}
              </div>
            </div>

            <div className={classes.dashboardItem}>
              <div className={classes.dashboardItemTitle}>
                <MdBorderClear size={30} className="mr-2" />
                <span>Quản lý cửa hàng</span>
              </div>
              <div className={classes.dashboardItemContent}>
                {sellers && sellers.length}
              </div>
              <Link to="/admin-sellers" className={classes.link}>
                Xem cửa hàng
              </Link>
            </div>

            <div className={classes.dashboardItem}>
              <div className={classes.dashboardItemTitle}>
                <AiOutlineMoneyCollect size={30} className="mr-2" />
                <span>Quản lý Đơn hàng</span>
              </div>
              <div className={classes.dashboardItemContent}>
                {adminOrders && adminOrders.length}
              </div>
              <Link to="/admin-orders" className={classes.link}>
                Xem đơn hàng
              </Link>
            </div>
          </div>

          <br />
          <h3 className="text-[22px] font-Poppins pb-2">Đơn hàng gần nhất</h3>
          <div className={classes.dataGridContainer}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
