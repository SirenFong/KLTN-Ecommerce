import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiArrowDownCircle } from "react-icons/fi";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData);
  }, [allProducts]);

  const loadMore = () => {
    setDisplayCount(displayCount + 10);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data &&
                data
                  .slice(0, displayCount)
                  .map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            {displayCount < data.length && (
              <div className="flex justify-center items-center">
                {" "}
                <button
                  className="flex justify-center items-center"
                  onClick={loadMore}
                >
                  <FiArrowDownCircle size={24} />
                  <span>Xem thêm</span>
                </button>
              </div>
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
