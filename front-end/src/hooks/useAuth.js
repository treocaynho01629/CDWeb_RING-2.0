import { useSelector } from "react-redux";
import { isPersist, selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    const persist = useSelector(isPersist);

    if (token) {
        const decoded = jwtDecode(token);
        const { id, sub, roles } = decoded;
        return { id, username: sub, roles }
    }

    return { token, id: null, username: null, isAdmin: null, persist }
}
export default useAuth