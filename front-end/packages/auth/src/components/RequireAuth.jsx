import { useState, useEffect, Suspense, lazy } from "react";
import { useLocation, Navigate, Outlet } from "react-router";
import { useRefreshMutation } from "@ring/redux";
import useAuth from "../hooks/useAuth";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));

const RequireAuth = ({ allowedRoles }) => {
  const { token, roles } = useAuth();
  const location = useLocation();
  const [pending, setPending] = useState(true);
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh().unwrap();
      } finally {
        isMounted && setPending(false);
      }
    };

    if (!token) {
      verifyRefreshToken();
    } else {
      setPending(false);
    }
    return () => (isMounted = false);
  }, []);

  return (
    <>
      {isLoading || pending ? (
        <Suspense fallback={null}>
          <PendingModal open={true} message="Đang xác thực đăng nhập ..." />
        </Suspense>
      ) : roles?.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet /> //Auth with ROLE
      ) : token ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace /> //To error page
      ) : (
        <Navigate
          to="/auth/login"
          state={{
            from: location,
            errorMsg: "Vui lòng đăng nhập để tiếp tục.",
          }}
          replace
        />
      )}
    </>
  );
};

export default RequireAuth;
