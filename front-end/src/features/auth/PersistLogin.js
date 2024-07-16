import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';
import usePersist from '../../hooks/usePersist';
import { Backdrop, CircularProgress, Container } from '@mui/material';

export default function PersistLogin() {
    const persist = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    const [trueSuccess, setTrueSuccess] = useState(false);

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log("Refreshing token");
                try {
                    await refresh()
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken();
        }

        return () => effectRan.current = true
    }, [])

    let content

    if (!persist) {
        content = <Outlet />
    } else if (isLoading) {
        console.log("Đang xác thực đăng nhập!");
        content = (
            <>
                <div style={{ height: '1000px' }}>&nbsp;</div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: 9999, position: 'fixed' }}
                    open={true}
                >
                    <CircularProgress color="inherit" />&nbsp;&nbsp;Đang xác thực đăng nhập...
                </Backdrop>
            </>
        )
    } else if (isError) {
        console.log("Lỗi xác thực!");
        content = (
            <div style={{marginTop: '150px'}}>
                <Container fluid maxWidth="lg">
                    <p className="errMsg">{`Đã xảy ra lỗi khi xác thực đăng nhập: ${error?.data?.message}`}</p>
                    <p>Vui lòng <Link to="/login"><b className="option">ĐĂNG NHẬP LẠI</b></Link></p>
                </Container>
            </div>
        )
    } else if (isSuccess && trueSuccess) {
        console.log("Xác thực hoàn tất!");
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    } else {
        content = (
            <>
                <div style={{ height: '1000px' }}>&nbsp;</div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: 9999, position: 'fixed' }}
                    open={true}
                >
                    <CircularProgress color="inherit" />&nbsp;Đang xác thực đăng nhập...
                </Backdrop>
            </>
        )
    }

    return content
}