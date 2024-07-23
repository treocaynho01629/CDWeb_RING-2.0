import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import useAuth from '../../hooks/useAuth';
import PendingIndicator from "../../components/authorize/PendingIndicator";

const PersistLogin = () => {
    const { token, persist } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, {
        isLoading: refreshing,
        isSuccess,
        isError,
    }] = useRefreshMutation();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        (!token && persist) ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    const pending = [persist, isLoading].every(Boolean);

    return (
        <>
            {!persist
                ? <Outlet />
                : pending
                    ?
                    <PendingIndicator open={pending} message="Đang xác thực đăng nhập ..." />
                    : isSuccess
                        ? <Outlet />
                        : isError
                        && <Navigate to="/login" state={{ from: location, errorMsg: 'Đã xảy ra lỗi xác thực, vui lòng đăng nhập lại!' }} replace /> //To login page if error
            }
        </>
    )
}

export default PersistLogin