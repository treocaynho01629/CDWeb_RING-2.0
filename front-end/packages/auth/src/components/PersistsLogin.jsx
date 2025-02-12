import { useState, useEffect, lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { Button } from "@mui/material";
import { useRefreshMutation, useSignOutMutation } from "@ring/redux";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const PendingModal = lazy(() => import("@ring/ui"));

const PersistLogin = () => {
  const { token, exp, persist } = useAuth();
  const [pending, setPending] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [refresh, { isLoading, isSuccess }] = useRefreshMutation();
  const [logout] = useSignOutMutation();
  const location = useLocation();
  const signOut = useLogout();

  useEffect(() => {
    let isMounted = true;
    const currentTime = Math.floor(Date.now() / 1000);
    const checkBuffer = 5 * 60;

    const verifyRefreshToken = async () => {
      try {
        await refresh().unwrap();
      } catch (error) {
        //Log user out if fail to refresh
        if (error?.status === 500) {
          setErrorMsg("Đã xảy ra lỗi xác thực, vui lòng đăng nhập lại!");
        } else if (error?.status === 400 || error?.status === 403) {
          setErrorMsg("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        }
        await logout().unwrap();
      } finally {
        isMounted && setPending(false);
      }
    };

    if (persist && (!token || (exp && currentTime > exp - checkBuffer))) {
      verifyRefreshToken();
    } else {
      setPending(false);
    }
    return () => (isMounted = false);
  }, []);

  return (
    <>
      {errorMsg && !pending ? (
        <Navigate
          to="/auth/login"
          state={{ from: location, errorMsg }}
          replace
        /> //To login page if error
      ) : !persist || token ? (
        <Outlet />
      ) : isLoading || pending ? (
        <Suspense>
          <PendingModal open={true} message="Đang xác thực đăng nhập ...">
            <Button variant="contained" color="error" onClick={() => signOut()}>
              Đăng xuất?
            </Button>
          </PendingModal>
        </Suspense>
      ) : isSuccess ? (
        <Outlet />
      ) : (
        <Navigate
          to="/auth/login"
          state={{ from: location, errorMsg }}
          replace
        />
      )}
    </>
  );
};

export default PersistLogin;
