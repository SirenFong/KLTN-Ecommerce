// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [origin, setOrigin] = useState("");
  const [tags, setTags] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [unit, setUnit] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  //
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [vat, setVat] = useState("5");
  //
  const [weight, setWeight] = useState("");
  const [material, setMaterial] = useState("");
  const [guarantee, setGuarantee] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Tạo sản phẩm thành công!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, navigate, success]);

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Tính toán giá bán dựa trên giá nhập và % thuế
  const calculateSellPrice = () => {
    const vatDecimal = parseFloat(vat) / 100;
    const originalPriceFloat = parseFloat(originalPrice);
    const sellPriceValue = originalPriceFloat + originalPriceFloat * vatDecimal;
    setSellPrice(sellPriceValue.toFixed(2)); // Giữ 2 chữ số sau dấu phẩy
  };
  // Thêm hàm định dạng tiền tệ của Việt Nam
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSelectedCategory(selectedCategory);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages((old) => [...old, ...newImages]);
            setFileKey((prevKey) => prevKey + 1);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.set("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("origin", origin);
    newForm.append("entryDate", entryDate);
    newForm.append("expiryDate", expiryDate);
    newForm.append("quantity", quantity);
    newForm.append("brand", brand);
    newForm.append("specifications", specifications);
    newForm.append("unit", unit);
    newForm.append("ingredient", ingredient);
    newForm.append("weight", weight);
    newForm.append("material", material);
    newForm.append("guarantee", guarantee);
    newForm.append("originalPrice", originalPrice);
    newForm.append("vat", vat);
    newForm.append("sellPrice", sellPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    dispatch(
      createProduct({
        name,
        description,
        category,
        origin,
        entryDate,
        expiryDate,
        quantity,
        brand,
        specifications,
        unit,
        ingredient,
        weight,
        material,
        guarantee,
        originalPrice,
        vat,
        sellPrice,
        stock,
        shopId: seller._id,
        images,
      })
    );
  };

  return (
    <div className="w-[100%] 800px:w-[90%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Tạo sản phẩm</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Danh mục sản phẩm <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="Choose a category">Chọn danh mục</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        {selectedCategory === "Thiết bị y tế" ? (
          <>
            <div>
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
                Mô tả sản phẩm <span className="text-red-500">*</span>
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
                placeholder="Nhập mô tả sản phẩm..."
              ></textarea>
            </div>
            <br />
            <div>
              <label className="pb-2">
                Xuất xứ <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="">Chọn xuất xứ</option>
                <option value="Vietnam">Vietnam</option>
                <option value="China">Trung Quốc</option>
                <option value="USA">Mỹ</option>
                <option value="DanMach">Đan mạch</option>
                <option value="Bi">Bỉ</option>
                <option value="Phap">Pháp</option>
                <option value="Anh">Anh</option>
              </select>
            </div>
            <br />
            <div>
              <label className="pb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quantity"
                value={quantity}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nhập số lượng sản phẩm..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Trọng lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="weight"
                value={weight}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Trọng lượng (g)"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Vật liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="material"
                value={material}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Vật liệu"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Quy cách đóng gói <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="material"
                value={specifications}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Vật liệu"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Bảo hành{" "}
                <span className="text-red-500">*Mặc định là 12 tháng</span>
              </label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={guarantee}
                onChange={(e) => setGuarantee(e.target.value)}
              >
                <option value="">Chọn trạng thái bảo hành</option>
                <option value="Có">Có</option>
                <option value="Không">Không</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
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
                Mô tả sản phẩm <span className="text-red-500">*</span>
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
                placeholder="Nhập mô tả sản phẩm..."
              ></textarea>
            </div>
            <div>
              <label className="pb-2">
                Tags <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setTags(e.target.value)}
                placeholder="Nhập tag sản phẩm..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Ngày nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="importDate"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Ngày hết hạn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Quy cách đóng gói <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specifications"
                value={specifications}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Quy cách đóng gói"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Thành phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ingredient"
                value={ingredient}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="Thành phần"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Đơn vị tính <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="unit"
                value={unit}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Đơn vị tính"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={brand}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Thương hiệu"
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Xuất xứ <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="">Chọn xuất xứ</option>
                <option value="Vietnam">Vietnam</option>
                <option value="China">Trung Quốc</option>
                <option value="USA">Mỹ</option>
                <option value="DanMach">Đan mạch</option>
                <option value="Bi">Bỉ</option>
                <option value="Phap">Pháp</option>
                <option value="Anh">Anh</option>
              </select>
            </div>
            <br />
            <div>
              <label className="pb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quantity"
                value={quantity}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nhập số lượng sản phẩm..."
              />
            </div>
          </>
        )}
        <br />

        <div>
          <label className="pb-2">
            Giá nhập <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="originalPrice"
            value={Number(originalPrice).toLocaleString("vi-VI")}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              setOriginalPrice(e.target.value.replace(/\D/g, "")); // Loại bỏ các ký tự không phải số
            }}
            onBlur={calculateSellPrice} // Tính toán giá bán khi giá nhập thay đổi
            placeholder="Nhập giá sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Thuế sản phẩm (%)</label>
          <input
            type="text"
            name="vat"
            value={vat}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              setVat(e.target.value);
              calculateSellPrice(); // Tính toán giá bán khi % thuế thay đổi
            }}
            placeholder="Nhập % thuế sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Giá bán{" "}
            <span className="text-red-500">
              (Giá bán sẽ được tự động tính bằng giá nhập * % thuế)
            </span>
          </label>
          <input
            type="text"
            name="sellPrice"
            value={formatCurrency(sellPrice)}
            readOnly // Đảm bảo giá bán chỉ được hiển thị và không thể chỉnh sửa
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="stock"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Nhập tồn kho sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Hình ảnh <span className="text-red-500">*</span>
          </label>
          <input
            key={fileKey}
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple // Cho phép chọn nhiều tệp tin
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i, index) => (
                <div key={i} className="relative">
                  <img
                    src={i}
                    alt=""
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                  <AiOutlineCloseCircle
                    size={30}
                    className="absolute top-0 right-0 cursor-pointer"
                    color="#555"
                    onClick={() => removeImage(index)}
                  />
                </div>
              ))}
          </div>
          <div>
            <input
              type="submit"
              value="Tạo sản phẩm"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
