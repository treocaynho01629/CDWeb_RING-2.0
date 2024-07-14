import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';

const PendingIndicator = lazy(() => import('../../components/authorize/PendingIndicator'));

const PersistLogin = () => {
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

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

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    return (
        <>
            {(persist && isLoading)
                    &&
                    <Suspense fallBack={<></>}>
                        <PendingIndicator open={isLoading} message="Đang xác thực đăng nhập ..."/>
                    </Suspense>
            }
            <Outlet />
        </>
    )
}

export default PersistLogin