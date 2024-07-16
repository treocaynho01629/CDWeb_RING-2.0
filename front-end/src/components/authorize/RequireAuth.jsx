import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role.roleName)) 
            ? <Outlet /> //Auth with ROLE
            : auth?.userName
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> //To error page
                : <Navigate to="/login" state={{ from: location }} replace /> //To login if not logged in
    );
}

export default RequireAuth;