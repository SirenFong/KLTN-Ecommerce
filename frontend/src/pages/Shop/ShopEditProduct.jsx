import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopEditProduct from "../../components/Shop/ShopEditProduct";

const ShopCreateProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar />
        </div>
        <div className="w-full justify-center flex">
          <ShopEditProduct />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateProduct;
