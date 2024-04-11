import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    if (data && data.category) {
      // Nếu có dữ liệu và có category
      const filteredProducts = // Lọc sản phẩm theo category
        allProducts && allProducts.filter((i) => i.category === data.category); // Lọc sản phẩm theo category
      setProductData(filteredProducts); // Gán sản phẩm đã lọc vào productData
    }
  }, [allProducts, data]); // useEffect chạy khi allProducts hoặc data thay đổi

  return (
    <div>
      {data ? ( // Nếu có dữ liệu thì hiển thị
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData &&
              productData.map((product) => (
                <ProductCard data={product} key={product.id} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
