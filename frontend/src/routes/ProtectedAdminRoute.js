import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user); // Lấy thông tin user từ redux store
  if (loading === false) {
    // Nếu đã load xong
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />; // Nếu chưa đăng nhập, chuyển hướng đến trang login
    } else if (user.role !== "Admin") {
      // Nếu không phải là admin
      return <Navigate to="/" replace />; // Chuyển hướng về trang chủ
    }
    return children;
  }
};

export default ProtectedAdminRoute;
