import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          setLoading(false);
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <>
          <Alert severity="error">Link đã hết hạn!</Alert>
          <Button
            variant="contained"
            color="primary"
            href="https://nhathuocthanhthuong.vercel.app/login"
            sx={{ mt: 2 }}
          >
            Trở về trang đăng nhập
          </Button>
        </>
      ) : (
        <>
          <Alert severity="success">Bạn đã đăng ký tài khoản thành công!</Alert>
          <Button
            variant="contained"
            color="primary"
            href="https://nhathuocthanhthuong.vercel.app/login"
            sx={{ mt: 2 }}
          >
            Trở về trang đăng nhập
          </Button>
        </>
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        {loading ? "Đang xử lý..." : ""}
      </Typography>
    </Container>
  );
};

export default ActivationPage;
