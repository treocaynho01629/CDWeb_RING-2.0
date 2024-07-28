import { useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import { logOut } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import { useSignoutMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signout] = useSignoutMutation();
    const [cookies, removeCookie] = useCookies(['refreshToken'])

    const logout = async (noQueue) => {
        try {
            await signout().unwrap();
            removeCookie('refreshToken', { path: '/' }); //Remove cookies
            dispatch(logOut()); //Reset auth state
            dispatch(apiSlice.util.resetApiState()); //Reset redux

            //Queue snack + goes to home
            if (!noQueue) {
                const { enqueueSnackbar } = await import('notistack');
                enqueueSnackbar('Đã đăng xuất!', { variant: 'error' });
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout