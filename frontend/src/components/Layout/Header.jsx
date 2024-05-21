import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { Button, Typography } from "@material-ui/core";
import { toast } from "react-toastify";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  const searchBoxRef = useRef(); // reference to the search box

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchData(null); // clear search data if click was outside the search box
      }
    };
    // add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
    setShowAllResults(false); // Reset to show limited results initially
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  const handleShowAllResults = () => {
    setShowAllResults(true);
  };

  const handleOpenCart = () => {
    if (!isAuthenticated) {
      toast.error("Đăng nhập để xem giỏ hàng!");
    } else {
      setOpenCart(true);
    }
  };

  const handleOpenWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập!");
    } else {
      setOpenWishlist(true);
    }
  };

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dgtostoep/image/upload/v1702905710/imgonline-com-ua-resize-kyOORaMPjDUL_1_at1rmh.jpg"
                alt=""
                style={{
                  width: "auto",
                  height: "80px",
                  marginTop: "0px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </Link>
          </div>

          <div className="w-[70%] flex items-center h-screen">
            <div className="w-[70%] relative" ref={searchBoxRef}>
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer"
              />
              {searchData && searchData.length !== 0 ? (
                <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                  {showAllResults
                    ? searchData.map((i, index) => (
                        <Link key={index} to={`/product/${i._id}`}>
                          <div className="w-full flex items-start py-3">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt={i.name}
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{i.name}</h1>
                          </div>
                        </Link>
                      ))
                    : searchData.slice(0, 5).map((i, index) => (
                        <Link key={index} to={`/product/${i._id}`}>
                          <div className="w-full flex items-start py-3">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt={i.name}
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{i.name}</h1>
                          </div>
                        </Link>
                      ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {searchData.length > 5 && !showAllResults && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaArrowAltCircleDown
                          size={20}
                          className="flex"
                          onClick={handleShowAllResults}
                        ></FaArrowAltCircleDown>
                        <p> Xem thêm</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {isSeller ? (
            <div>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/dashboard"
              >
                <Typography variant="h9" className="flex items-center">
                  Trang quản lý <ArrowForwardIosIcon className="ml-1" />
                </Typography>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                Danh mục
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={handleOpenWishlist}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#ae3131] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={handleOpenCart}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                {user?.cart?.length > 0 && (
                  <span className="absolute right-0 top-0 rounded-full bg-[#ae3131] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {user?.cart?.length}
                  </span>
                )}
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
