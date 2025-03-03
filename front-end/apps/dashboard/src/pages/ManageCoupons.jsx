import { useState, Suspense, lazy } from "react";
import { Box, Button } from "@mui/material";
import { Add, Loyalty } from "@mui/icons-material";
import { NavLink } from "react-router";
import { HeaderContainer } from "../components/custom/Components";
import { useTitle } from "@ring/shared";
import { useAuth } from "@ring/auth";
import {
  couponsApiSlice,
  useGetCouponAnalyticsQuery,
} from "../features/coupons/couponsApiSlice";
import InfoCard from "../components/custom/InfoCard";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";
import TableCoupons from "../components/table/TableCoupons";

const CouponFormDialog = lazy(
  () => import("../components/dialog/CouponFormDialog")
);
const PendingModal = lazy(() => import("@ring/ui/PendingModal"));

const ManageCoupons = () => {
  const { shop } = useAuth();
  const [contextCoupon, setContextCoupon] = useState(null);
  const [open, setOpen] = useState(undefined);
  const [pending, setPending] = useState(false);
  const { data: couponAnalytics } = useGetCouponAnalyticsQuery(shop ?? null);
  const [getCoupon, { isLoading }] = couponsApiSlice.useLazyGetCouponQuery();

  //Set title
  useTitle("Mã giảm giá");

  const handleOpen = () => {
    setContextCoupon(null);
    setOpen(true);
  };

  const handleOpenEdit = (couponId) => {
    getCoupon(couponId)
      .unwrap()
      .then((coupon) => {
        setContextCoupon(coupon);
        setOpen(true);
      })
      .catch((rejected) => console.error(rejected));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {(isLoading || pending) && (
        <Suspense fallBack={null}>
          <PendingModal
            open={isLoading || pending}
            message="Đang gửi yêu cầu..."
          />
        </Suspense>
      )}
      <HeaderContainer>
        <div>
          <h2>Quản lý mã giảm giá</h2>
          <CustomBreadcrumbs separator="." maxItems={4} aria-label="breadcrumb">
            <NavLink to={"/coupon"}>Quản lý mã giảm giá</NavLink>
          </CustomBreadcrumbs>
        </div>
        <Button variant="outlined" startIcon={<Add />} onClick={handleOpen}>
          Thêm
        </Button>
      </HeaderContainer>
      <Box mb={3}>
        <InfoCard
          icon={<Loyalty color="error" />}
          info={couponAnalytics}
          color="error"
        />
      </Box>
      <TableCoupons {...{ shop, handleOpenEdit, pending, setPending }} />
      <Suspense fallback={null}>
        {open !== undefined && (
          <CouponFormDialog
            {...{
              open,
              handleClose,
              shop,
              coupon: contextCoupon,
              pending,
              setPending,
            }}
          />
        )}
      </Suspense>
    </>
  );
};

export default ManageCoupons;
