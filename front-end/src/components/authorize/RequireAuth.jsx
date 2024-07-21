import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { token, roles } = useAuth();
    const location = useLocation();

    console.log(allowedRoles);

    console.log(roles);

    console.log(roles?.find(role => allowedRoles?.includes(role)) )

    return (
        roles?.find(role => allowedRoles?.includes(role)) 
            ? <Outlet /> //Auth with ROLE
            : token
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> //To error page
                : <Navigate to="/login" state={{ from: location }} replace /> //To login if not logged in
    );
}

export default RequireAuth;