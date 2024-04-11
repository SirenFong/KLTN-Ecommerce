import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  if (loading === false) {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập
      return <Navigate to="/login" replace />; // Chuyển hướng đến trang login
    }
    return children;
  }
};

export default ProtectedRoute;
