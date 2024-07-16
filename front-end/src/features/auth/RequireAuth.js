import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ onlyAdmin }) => {
    const location = useLocation();
    const { username, isAdmin } = useAuth();

    const content = ( 
        (username && (!onlyAdmin || isAdmin))
        ? <Outlet/> 
        : username
            ? <Navigate to="/unauthorized" state={{ from: location }} replace/>
            : <Navigate to="/login" state={{ from: location }} replace/>
    )

    return content
}
export default RequireAuth