import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role.roleName)) 
            ? <Outlet /> //Người dùng có đúng ROLE
            : auth?.userName
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> //Sai Role và đã Đăng nhập
                : <Navigate to="/login" state={{ from: location }} replace /> //Chưa đăng nhập
    );
}

export default RequireAuth;