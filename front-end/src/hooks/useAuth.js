import { useSelector } from "react-redux";
import { isPersist, selectCurrentToken, selectShop } from "../features/auth/authReducer";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    const shop = useSelector(selectShop);
    const persist = useSelector(isPersist);

    if (token) { //Extract data
        const decoded = jwtDecode(token);
        const { id, sub, roles, image, exp } = decoded;
        return { 
            token, 
            shop, 
            id, 
            username: sub, 
            image, 
            roles, 
            exp, 
            persist //FIX THIS AND THE PERSIST LOGIN CONDITION
        }
    }

    return { 
        token, 
        shop, 
        id: null, 
        username: null, 
        image: null, 
        roles: null, 
        exp: null, 
        persist 
    }
}
export default useAuth