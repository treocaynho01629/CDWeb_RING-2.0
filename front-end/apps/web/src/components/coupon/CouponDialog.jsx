import { useEffect, useRef, useState } from "react";
import {
  Check,
  Close,
  ExpandMore,
  LocalActivityOutlined,
  Loyalty,
  SaveAlt,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  Box,
  Skeleton,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  useGetCouponQuery,
  useGetCouponsQuery,
} from "../../features/coupons/couponsApiSlice";
import { couponTypes } from "@ring/shared";
import { Instruction } from "@ring/ui/Components";
import { trackWindowScroll } from "react-lazy-load-image-component";
import CouponItem from "./CouponItem";
import styled from "@emotion/styled";
import useCoupon from "../../hooks/useCoupon";

//#region styled
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DetailTitle = styled.h4`
  margin: 10px 0;
  font-size: 17px;
  font-weight: 600;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin: 5px 0 5px 10px;
  }
`;

const CouponContainer = styled.div`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => `${theme.spacing(0)} ${theme.spacing(1)}`};
  }
`;

const InputContainer = styled.div`
  display: flex;
`;

const CouponsContainer = styled.div``;

const Showmore = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.info.main};
  cursor: pointer;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 0;
  }
`;
//#endregion

const defaultSize = 4;
const DEFAULT_PAGINATON = {
  number: 0,
  size: defaultSize,
  totalPages: 0,
  isMore: true,
};

const CouponDialog = ({
  numSelected,
  selectMode = false,
  shopId,
  checkState,
  open,
  selectedCoupon,
  handleClose,
  onSubmit,
  scrollPosition,
}) => {
  const { coupons: savedCoupons } = useCoupon();
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const inputRef = useRef(null);
  const [couponInput, setCouponInput] = useState("");
  const [currCoupon, setCurrCoupon] = useState(selectedCoupon);
  const [tempCoupon, setTempCoupon] = useState(selectedCoupon);
  const [saved, setSaved] = useState(false);
  const [shipPagination, setShipPagination] = useState(DEFAULT_PAGINATON);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATON);

  //Fetch coupons
  const {
    data: shipping,
    isLoading: loadShipping,
    isFetching: fetchShipping,
    isSuccess: doneShipping,
    isError: errorShipping,
  } = useGetCouponsQuery(
    {
      shopId,
      types: [couponTypes.SHIPPING.value],
      byShop: shopId != null,
      cValue: checkState?.value,
      cQuantity: checkState?.quantity,
      size: shipPagination.size,
      page: shipPagination.number,
      loadMore: shipPagination.isMore,
    },
    { skip: (!shopId && !selectMode) || saved }
  );
  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetCouponsQuery(
      {
        shopId,
        types: saved
          ? []
          : [couponTypes.MIN_VALUE.value, couponTypes.MIN_AMOUNT.value],
        codes: saved
          ? savedCoupons?.length > 0
            ? savedCoupons
            : ["temp"]
          : [],
        byShop: shopId != null,
        cValue: checkState?.value,
        cQuantity: checkState?.quantity,
        size: pagination.size,
        page: pagination.number,
        loadMore: pagination.isMore,
      },
      { skip: !shopId && !selectMode }
    );

  //Fetch coupon by code
  const {
    data: code,
    isLoading: loadCode,
    isSuccess: doneCode,
    isError: errorCode,
  } = useGetCouponQuery(
    {
      code: couponInput,
      cValue: checkState?.value,
      cQuantity: checkState?.quantity,
    },
    { skip: !couponInput || !selectMode }
  );

  //Reset stuff
  useEffect(() => {
    setCouponInput("");
    setCurrCoupon(selectedCoupon);
    setTempCoupon(selectedCoupon);
  }, [shopId, selectedCoupon]);

  useEffect(() => {
    setPagination(DEFAULT_PAGINATON);
  }, [saved]);

  //Update selected/input coupon
  useEffect(() => {
    if (doneCode && !loadCode && code) {
      setCurrCoupon(code);
      if (code?.isUsable && code?.shopId == shopId) setTempCoupon(code);
    }
  }, [code, loadCode, selectedCoupon]);

  useEffect(() => {
    if (data && !isLoading && isSuccess) {
      setPagination({
        ...pagination,
        number: data.page.number,
        totalPages: data.page.totalPages,
      });
    }
  }, [data]);

  useEffect(() => {
    if (shipping && !loadShipping && doneShipping) {
      setShipPagination({
        ...shipPagination,
        number: shipping.page.number,
        totalPages: shipping.page.totalPages,
      });
    }
  }, [shipping]);

  const handleChangeInput = () => {
    setCouponInput(inputRef?.current?.value);
  };
  const handleClickApply = (coupon, shopId) => {
    if (onSubmit) onSubmit(coupon, shopId);
    handleClose();
  };

  const handleShowMoreShipping = () => {
    if (
      fetchShipping ||
      typeof shipping?.page?.number !== "number" ||
      shipping?.page?.number < shipPagination?.number
    )
      return;
    const nextPage = shipping?.page?.number + 1;
    if (nextPage < shipping?.page?.totalPages)
      setShipPagination((prev) => ({ ...prev, number: nextPage }));
  };

  const handleShowMore = () => {
    if (
      isFetching ||
      typeof data?.page?.number !== "number" ||
      data?.page?.number < pagination?.number
    )
      return;
    const nextPage = data?.page?.number + 1;
    if (nextPage < data?.page?.totalPages)
      setPagination((prev) => ({ ...prev, number: nextPage }));
  };

  const toggleSaved = () => {
    setSaved((prev) => !prev);
  };

  //Display contents
  let coupons;
  let shippingCoupons;
  let topCoupon;

  let loadingComponent = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={{ xs: 85, sm: 155 }}
    >
      <CircularProgress color="primary" />
    </Box>
  );

  if (loadShipping || errorShipping) {
    shippingCoupons = (
      <>
        <Skeleton
          variant="text"
          sx={{
            fontSize: "17px",
            margin: { xs: "5px 0 5px 10px", sm: "10px 0" },
          }}
          width="30%"
        />
        {loadingComponent}
      </>
    );
  } else if (doneShipping) {
    const { ids, entities } = shipping;

    shippingCoupons = ids?.length ? (
      <>
        <DetailTitle>Mã vận chuyển</DetailTitle>
        {ids?.map((id, index) => {
          const coupon = entities[id];
          const summary = couponTypes[coupon?.type];
          const isDisabled = selectMode && !coupon.isUsable;
          const isSelected = tempCoupon?.id == id;
          const isSaved = savedCoupons?.indexOf(coupon?.code) != -1;

          return (
            <CouponItem
              key={`coupon-${id}-${index}`}
              {...{
                coupon,
                summary,
                selectMode,
                isDisabled,
                isSelected,
                isSaved,
                onClickApply: setTempCoupon,
                scrollPosition,
              }}
            />
          );
        })}
      </>
    ) : null;
  }

  if (isLoading || isError) {
    coupons = (
      <>
        <Skeleton
          variant="text"
          sx={{
            fontSize: "17px",
            margin: { xs: "5px 0 5px 10px", sm: "10px 0" },
          }}
          width="30%"
        />
        {loadingComponent}
      </>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    coupons = ids?.length ? (
      <>
        <DetailTitle>{saved ? "Mã đã lưu" : "Mã giảm giá"}</DetailTitle>
        {ids?.map((id, index) => {
          const coupon = entities[id];
          const summary = couponTypes[coupon?.type];
          const isDisabled = selectMode && !coupon.isUsable;
          const isSelected = tempCoupon?.id == id;
          const isSaved = savedCoupons?.indexOf(coupon?.code) != -1;

          return (
            <CouponItem
              key={`coupon-${id}-${index}`}
              {...{
                coupon,
                summary,
                selectMode,
                isDisabled,
                isSelected,
                isSaved,
                onClickApply: setTempCoupon,
              }}
            />
          );
        })}
      </>
    ) : null;
  }

  if (currCoupon) {
    const summary = couponTypes[currCoupon?.type];
    const isDisabled =
      selectMode && (!currCoupon?.isUsable || currCoupon?.shopId != shopId);
    const isSelected = tempCoupon?.id == currCoupon?.id;

    topCoupon = (
      <CouponItem
        key={`top-coupon-${currCoupon?.id}`}
        {...{
          coupon: currCoupon,
          summary,
          selectMode,
          isDisabled,
          isSelected,
          onClickApply: setTempCoupon,
        }}
      />
    );
  }

  return (
    <Dialog
      open={open}
      scroll={"paper"}
      maxWidth={"sm"}
      fullWidth
      onClose={handleClose}
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <TitleContainer>
          <Loyalty />
          &nbsp;Thông tin ưu đãi
        </TitleContainer>
        {selectMode && (
          <Button
            size="small"
            color={saved ? "" : "warning"}
            startIcon={saved ? <KeyboardArrowLeft /> : <SaveAlt />}
            onClick={toggleSaved}
          >
            {saved ? "Trở về" : "Đã lưu"}
          </Button>
        )}
      </DialogTitle>
      {selectMode && (
        <CouponContainer>
          <InputContainer>
            <TextField
              placeholder="Nhập mã giảm giá"
              type="text"
              id="coupon"
              inputRef={inputRef}
              error={errorCode}
              size="small"
              fullWidth
              disabled={!numSelected}
              slotProps={{
                input: {
                  startAdornment: (
                    <LocalActivityOutlined
                      style={{ color: "gray", marginRight: "5px" }}
                    />
                  ),
                },
              }}
            />
            <Button
              variant="contained"
              sx={{ width: 125, ml: 1, boxShadow: "none" }}
              disabled={!numSelected}
              onClick={handleChangeInput}
            >
              Áp dụng
            </Button>
          </InputContainer>
          <Instruction>
            {errorCode
              ? "Mã không hợp lệ"
              : !numSelected && "Vui lòng chọn sản phẩm để sử dụng mã"}
          </Instruction>
          {topCoupon}
        </CouponContainer>
      )}
      <DialogContent sx={{ pt: 0, px: { xs: 1, sm: 3 }, height: "100dvh" }}>
        <CouponsContainer>
          {!saved && (
            <>
              {shippingCoupons}
              {!loadShipping &&
                shipPagination.totalPages > shipPagination.number + 1 && (
                  <Showmore onClick={handleShowMoreShipping}>
                    Xem thêm
                    <ExpandMore />
                  </Showmore>
                )}
              {fetchShipping && !loadShipping && loadingComponent}
            </>
          )}
          {coupons}
          {!isLoading && pagination.totalPages > pagination.number + 1 && (
            <Showmore onClick={handleShowMore}>
              Xem thêm
              <ExpandMore />
            </Showmore>
          )}
          {isFetching && !isLoading && loadingComponent}
          {!coupons && (saved || !shippingCoupons) && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={6}
            >
              Hiện không có khuyến mãi
            </Box>
          )}
        </CouponsContainer>
      </DialogContent>
      <DialogActions>
        {selectMode && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginY: "10px" }}
            startIcon={<Check />}
            onClick={() => handleClickApply(tempCoupon, shopId)}
          >
            Xác nhận
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: "10px" }}
          startIcon={<Close />}
          onClick={handleClose}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default trackWindowScroll(CouponDialog);
