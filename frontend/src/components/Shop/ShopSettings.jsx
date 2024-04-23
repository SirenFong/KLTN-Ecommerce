/* eslint-disable jsx-a11y/aria-props */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Đã thay ảnh đại diện!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Thông tin cập nhật thành công!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box position="relative">
            <Avatar
              src={avatar ? avatar : `${seller.avatar?.url}`}
              alt=""
              style={{
                width: 200,
                height: 200,
                cursor: "pointer",
                borderRadius: "50%",
              }}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                position: "absolute",
                bottom: 10,
                right: 0,
                transform: "translateX(50%)",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: 5,
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              component="label"
              htmlFor="image"
            >
              <PhotoCamera />
              <input
                type="file"
                id="image"
                style={{ display: "none" }}
                onChange={handleImage}
              />
            </Box>
          </Box>
        </Box>

        <form onSubmit={updateHandler} style={{ width: "100%", marginTop: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tên cửa hàng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mô tả cửa hàng"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Hotline"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid className="pt-5" item xs={12} md={6}>
              <TextField
                label="Zipcode"
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Cập nhật
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default ShopSettings;
