import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

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

    useEffect(() => {
        if (isLoading) {
            console.log('Đang xác thực đăng nhập');
        } else {
            console.log('Xác thực hoàn tất!');
        }
    }, [isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ?
                    <Backdrop sx={{ color: 'white'}} open={true}>
                        <CircularProgress
                        sx={{
                          color: '#63e399',
                          marginRight: '10px',
                        }}
                        size={40}
                        thickness={5}
                        />
                        <b>Đang xác thực đăng nhập ...</b>
                    </Backdrop>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin