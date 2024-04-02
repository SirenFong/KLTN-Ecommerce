import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-start">
          <img
            src="https://www.cerave.com.vn/-/media/project/loreal/brand-sites/cerave/shared/baseline/latam_cerave_header_logo/latam_cerave_header_logo.svg?rev=55fbb872ef8a4f21ac897acb6286962f?w=0&hash=88112E6D98057C9E5AEA188284EB6F1E"
            alt=""
            style={{ width: "150px", objectFit: "contain" }}
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://cocoonvietnam.com/_nuxt/img/logo.f502f17.svg"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://pos.nvncdn.com/82e158-40396/store/20190104_WzX6uLjkd62deHAlMLUlyW4M.png"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://www.newnordic.ca/cdn/shop/files/NewNordic_Logo.webp?v=1690354552"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="http://biogaia.vn/images/2015/08/27/logo.png"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
