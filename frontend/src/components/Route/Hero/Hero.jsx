import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/djxsh5hhw/image/upload/v1703686408/20773_yngarp.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Đồ dùng y tế <br />
        </h1>
        <p className="pt-5 text-[16px] font-[Times New Roman] font-[400] text-[#000000ba]">
          Trực thuộc Công ty cổ phần bán lẻ kỹ thuật số, hệ thống Nhà thuốc
          Thanh Thương là một trong những chuỗi bán lẻ dược phẩm uy tín tại Việt
          Nam. Với hơn 1000 Nhà thuốc tại hơn 63 tỉnh thành (cuối năm 2023), nhà
          thuốc Thanh Thương chuyên cung cấp đa dạng các loại thuốc cùng các sản
          phẩm thực phẩm chức năng, trang thiết bị y tế, dược mỹ phẩm và nhiều
          sản phẩm chăm sóc sức khoẻ, tiêu dùng hàng ngày,....
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Times New Roman] text-[18px]">
              Mua ngay !!
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
