/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
// import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null); // Avatar
  const useStyles = makeStyles((theme) => ({
    button: {
      width: 250,
      height: 40,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      marginTop: theme.spacing(3),
      cursor: "pointer",
      backgroundColor: "transparent",
      border: `1px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
  }));

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" }); // Xóa lỗi
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" }); // Xóa thông báo
    }
  }, [dispatch, error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const reader = new FileReader(); // Đọc file

    reader.onload = () => {
      // Khi load file
      if (reader.readyState === 2) {
        // Nếu file đã load
        setAvatar(reader.result); // Gán file đã load vào avatar
        axios // Cập nhật ảnh đại diện của user
          .put(
            `${server}/user/update-avatar`, // Đường dẫn cập nhật ảnh đại diện
            { avatar: reader.result }, // Ảnh đại diện
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            // Nếu cập nhật thành công
            dispatch(loadUser());
            toast.success("Đã cập nhật ảnh đại diện!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]); // Đọc file dưới dạng URL
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Họ và tên"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="email"
                    name="email"
                    label="Địa chỉ Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Số điện thoại"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="password"
                    name="password"
                    label="Nhập mật khẩu"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Cập nhật
              </Button>
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    // { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Trạng Thái đơn hàng",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng sản phẩm",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng tiền",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: item.totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    // { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Trạng Thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng sản phẩm",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng cộng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: item.totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã giao hàng"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng sản phẩm",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng cộng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: item.totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error("Mật khẩu cũ không đúng!");
      });
  };
  return (
    <Box p={2}>
      <h1 className="text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Đổi mật khẩu
      </h1>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
          <form onSubmit={passwordChangeHandler}>
            <TextField
              label="Nhập mật khẩu cũ"
              type="password"
              fullWidth
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
            />

            <TextField
              label="Nhập mật khẩu mới"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />

            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <br />
            <br />
            <Button type="submit" color="primary" variant="contained" fullWidth>
              Đổi mật khẩu
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Nhà riêng",
    },
    {
      name: "Cơ quan",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Vui lòng điền đủ thông tin nhận hàng!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Thêm địa chỉ</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Chọn quốc gia"
              select
              fullWidth
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </TextField>
            <br />
            <br />

            <TextField
              label="Chọn Tỉnh/Thành phố"
              select
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </TextField>

            <br />
            <br />

            <TextField
              label="Địa chỉ nhà"
              fullWidth
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />

            <br />
            <br />

            <TextField
              label="Nhập Quận/Huyện"
              fullWidth
              required
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />

            <br />
            <br />

            <TextField
              label="Zip Code"
              fullWidth
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />

            <br />
            <br />

            <TextField
              label="Loại địa chỉ"
              select
              fullWidth
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {addressTypeData &&
                addressTypeData.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </TextField>
            <br />
            <br />
            <Button type="submit" color="primary" variant="contained" fullWidth>
              Lưu
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Thêm địa chỉ
      </Button>

      <List>
        {user &&
          user.addresses.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.addressType}
                secondary={`${item.address1} ${item.address2}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(item)}>
                  <AiOutlineDelete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          Bạn chưa có địa chỉ đã lưu!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;
