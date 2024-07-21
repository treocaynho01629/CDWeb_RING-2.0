import { useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import { logOut } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import { useSignoutMutation } from "../features/auth/authApiSlice";

const useLogout = () => {
    const dispatch = useDispatch();
    const [signout] = useSignoutMutation();
    const [cookies, removeCookie] = useCookies(['refreshToken'])

    const logout = async () => {
        try {
            await signout().unwrap();
            removeCookie('refreshToken', { path: '/' }); //Remove cookies
            dispatch(logOut()); //Reset auth state
            dispatch(apiSlice.util.resetApiState()); //Reset redux
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout