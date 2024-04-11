import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [unit, setUnit] = useState("");
  const [brand, setBrand] = useState("");
  //
  // const [sellPrice, setSellPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [percentDiscount, setPercentDiscount] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  //
  const [stock, setStock] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const resetForm = () => {
    setImages([]);
    setName("");
    setDescription("");
    setCategory("");
    setTags("");
    setUnit("");
    setBrand("");
    setOriginalPrice();
    setDiscountPrice();
    setStock();
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    // Tính giá giảm
    const discount = originalPrice * (percentDiscount / 100); // Tính giá giảm
    setDiscountPrice(originalPrice - discount);
  }, [originalPrice, percentDiscount]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Tạo sự kiện thành công!");
      navigate("/dashboard-events");
      resetForm();
      window.location.reload();
    }
  }, [dispatch, error, navigate, success]);

  const handleStartDateChange = (e) => {
    // Xử lý thay đổi ngày bắt đầu
    const startDate = new Date(e.target.value); // Lấy ngày bắt đầu
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000); // Lấy ngày kết thúc
    setStartDate(startDate); // Cập nhật ngày bắt đầu
    setEndDate(null); // Xóa ngày kết thúc
    document.getElementById("end-date").min = minEndDate // Cập nhật ngày kết thúc
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    // Xử lý thay đổi ngày kết thúc
    const endDate = new Date(e.target.value); // Lấy ngày kết thúc
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10); // Lấy ngày hiện tại

  const minEndDate = startDate // Lấy ngày kết thúc
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Tạo sự kiện thành công!");
      navigate("/dashboard-events");
      setStartDate(null);
      setEndDate(null);
      window.location.reload(true);
    }
  }, [error, navigate, success]);

  const handleImageChange = (e) => {
    // Xử lý thay đổi hình ảnh
    const files = Array.from(e.target.files); // Lấy hình ảnh

    setImages([]); // Xóa hình ảnh

    files.forEach((file) => {
      // Lặp qua từng hình ảnh
      const reader = new FileReader(); // Đọc hình ảnh

      reader.onload = () => {
        // Khi đã đọc xong
        if (reader.readyState === 2) {
          // Nếu đã đọc xong
          setImages((old) => [...old, reader.result]); // Thêm hình ảnh vào mảng images
        }
      };
      reader.readAsDataURL(file); // Đọc hình ảnh
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData(); // Tạo form data

    images.forEach((image) => {
      // Lặp qua từng hình ảnh
      newForm.append("images", image);
    });
    const data = {
      // Dữ liệu cần gửi
      name,
      description,
      category,
      tags,
      unit,
      brand,
      setOriginalPrice,
      percentDiscount,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    }; // Dữ liệu cần gửi
    dispatch(createevent(data));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Tạo sự kiện</h5>
      {/* Tạo sự kiện */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="pb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả sản phẩm..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Chọn danh mục sản phẩm</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Đơn vị tính</label>
          <input
            type="text"
            name="unit"
            value={unit}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={brand}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Giá sản phẩm</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập giá sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">(%) Giảm giá</label>
          <input
            type="number"
            name="price"
            value={percentDiscount}
            onChange={(e) => setPercentDiscount(Number(e.target.value))}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="(%) Giảm giá"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Giá giảm<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="price"
            readOnly
            value={discountPrice.toLocaleString()}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) =>
              setDiscountPrice(Number(e.target.value.replace(/,/g, "")))
            }
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Nhập số lượng tồn..."
          />
        </div>
        <br />
        <div className="mb-4">
          <label className="pb-2">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Ngày kết thúc <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload hình ảnh <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <div className="mb-4">
            <input
              type="submit"
              value="Chạy sự kiện"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={
                !name ||
                !description ||
                !category ||
                !unit ||
                !brand ||
                !discountPrice ||
                !stock ||
                !startDate ||
                !endDate ||
                images.length === 0
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
