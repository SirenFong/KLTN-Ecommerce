import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

const DashboardSideBar = ({ active }) => {
  return (
    <List component="nav">
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <RxDashboard
            size={30}
            color={`${active === 1 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Trang chủ" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-orders">
        <ListItemIcon>
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Quản lý đơn hàng" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-products">
        <ListItemIcon>
          <FiPackage size={30} color={`${active === 3 ? "crimson" : "#555"}`} />
        </ListItemIcon>
        <ListItemText primary="Quản lý sản phẩm" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-create-product">
        <ListItemIcon>
          <AiOutlineFolderAdd
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Tạo sản phẩm" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-events">
        <ListItemIcon>
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Quản lý sự kiện" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-create-event">
        <ListItemIcon>
          <VscNewFile
            size={30}
            color={`${active === 6 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Tạo sự kiện" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-messages">
        <ListItemIcon>
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Trò chuyện" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-coupouns">
        <ListItemIcon>
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Mã giảm giá" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard-refunds">
        <ListItemIcon>
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Hoàn trả đơn hàng" />
      </ListItem>
      <ListItem button component={Link} to="/settings">
        <ListItemIcon>
          <CiSettings
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
        </ListItemIcon>
        <ListItemText primary="Cài đặt" />
      </ListItem>
    </List>
  );
};

export default DashboardSideBar;
