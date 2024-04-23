import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { AppBar, Toolbar, IconButton, Avatar } from "@material-ui/core";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dgtostoep/image/upload/v1702905710/imgonline-com-ua-resize-kyOORaMPjDUL_1_at1rmh.jpg"
              alt=""
            />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to="/dashboard/cupouns">
            <AiOutlineGift />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to="/dashboard-events">
            <MdOutlineLocalOffer />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to="/dashboard-products">
            <FiShoppingBag />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to="/dashboard-orders">
            <FiPackage />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to="/dashboard-messages">
            <BiMessageSquareDetail />
          </Link>
        </IconButton>
        <IconButton color="inherit">
          <Link to={`/shop/${seller._id}`}>
            <Avatar src={`${seller.avatar?.url}`} />
          </Link>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
