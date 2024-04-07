import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const { allProducts } = useSelector((state) => state.products);

  const data = useMemo(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
    return sortedData.slice(0, 5);
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Giá tốt hôm nay</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data.map((i, index) => (
            <ProductCard data={i} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
