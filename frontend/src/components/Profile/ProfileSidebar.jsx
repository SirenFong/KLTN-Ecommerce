import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  active: {
    color: "red",
  },
}));

const ProfileSidebar = ({ setActive, active }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login");
        window.location.reload(true);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Logout failed");
      });
  };

  return (
    <List component="nav" className={classes.root}>
      <ListItem button onClick={() => setActive(1)}>
        <ListItemIcon>
          <RxPerson size={20} className={active === 1 ? classes.active : ""} />
        </ListItemIcon>
        <ListItemText primary="Thông tin cá nhân" />
      </ListItem>
      <ListItem button onClick={() => setActive(2)}>
        <ListItemIcon>
          <HiOutlineShoppingBag
            size={20}
            className={active === 2 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Đơn hàng" />
      </ListItem>
      <ListItem button onClick={() => setActive(3)}>
        <ListItemIcon>
          <HiOutlineReceiptRefund
            size={20}
            className={active === 3 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Hoàn trả" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          setActive(4);
          navigate("/inbox");
        }}
      >
        <ListItemIcon>
          <AiOutlineMessage
            size={20}
            className={active === 4 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Tin nhắn" />
      </ListItem>
      <ListItem button onClick={() => setActive(5)}>
        <ListItemIcon>
          <MdOutlineTrackChanges
            size={20}
            className={active === 5 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Theo dõi đơn hàng" />
      </ListItem>
      <ListItem button onClick={() => setActive(6)}>
        <ListItemIcon>
          <RiLockPasswordLine
            size={20}
            className={active === 6 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Đổi mật khẩu" />
      </ListItem>
      <ListItem button onClick={() => setActive(7)}>
        <ListItemIcon>
          <TbAddressBook
            size={20}
            className={active === 7 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Địa chỉ giao hàng" />
      </ListItem>
      {user && user?.role === "Admin" && (
        <Link
          to="/admin/dashboard"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ListItem button onClick={() => setActive(8)}>
            <ListItemIcon>
              <MdOutlineAdminPanelSettings
                size={20}
                className={active === 8 ? classes.active : ""}
              />
            </ListItemIcon>
            <ListItemText primary="Quản lý Admin" />
          </ListItem>
        </Link>
      )}
      <ListItem button onClick={logoutHandler}>
        <ListItemIcon>
          <AiOutlineLogin
            size={20}
            className={active === 9 ? classes.active : ""}
          />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </ListItem>
    </List>
  );
};

export default ProfileSidebar;
