import axios from "../api/axios";
import useAuth from "./useAuth";
import { useCookies  } from 'react-cookie';

const useLogout = () => {
    const { auth, setAuth } = useAuth();
    const [ cookies, removeCookie ] = useCookies(['refreshToken'])

    const logout = async () => {
        try {
            const response = await axios.get('/api/v1/auth/logout',
                {
                    headers: { 'Content-Type': 'application/json' ,
                            'Authorization': 'Bearer ' + auth?.accessToken},
                    withCredentials: true
                }
            );
        } catch (err) {
            console.error(err);
        }

        //Xoá auth, xoá cookie
        setAuth({});
        removeCookie('refreshToken', { path: '/'});
        localStorage.removeItem("auth");
        localStorage.removeItem("persist");
    }

    return logout;
}

export default useLogout