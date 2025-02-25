import { useEffect, useRef, useState } from "react";
import {
  Check,
  Close,
  LocalActivityOutlined,
  Loyalty,
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
  useTheme,
} from "@mui/material";
import {
  useGetCouponQuery,
  useGetCouponsQuery,
} from "../../features/coupons/couponsApiSlice";
import { couponTypes } from "@ring/shared";
import { Instruction } from "@ring/ui/Components";
import CouponItem from "./CouponItem";
import styled from "@emotion/styled";

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
    padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  }
`;

const InputContainer = styled.div`
  display: flex;
`;

const CouponsContainer = styled.div``;
//#endregion

const CouponDialog = ({
  numSelected,
  selectMode = false,
  shopId,
  checkState,
  open,
  selectedCoupon,
  handleClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef(null);
  const [couponInput, setCouponInput] = useState("");
  const [currCoupon, setCurrCoupon] = useState(selectedCoupon);
  const [tempCoupon, setTempCoupon] = useState(selectedCoupon);

  //Fetch coupons
  const {
    data: shipping,
    isLoading: loadShipping,
    isSuccess: doneShipping,
    isError: errorShipping,
  } = useGetCouponsQuery(
    {
      shopId,
      types: ["SHIPPING"],
      byShop: shopId != null,
      cValue: checkState?.value,
      cQuantity: checkState?.quantity,
      size: 4,
    },
    { skip: !shopId && !selectMode }
  );
  const { data, isLoading, isSuccess, isError } = useGetCouponsQuery(
    {
      shopId,
      types: ["MIN_VALUE", "MIN_AMOUNT"],
      byShop: shopId != null,
      cValue: checkState?.value,
      cQuantity: checkState?.quantity,
      size: 4,
    },
    { skip: !shopId && !selectMode }
  );

  //Fetch coupon with code
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

  //Update selected/input coupon
  useEffect(() => {
    if (doneCode && !loadCode && code) {
      setCurrCoupon(code);
      if (code?.isUsable && code?.shopId == shopId) setTempCoupon(code);
    }
  }, [code, loadCode, selectedCoupon]);

  const handleChangeInput = () => {
    setCouponInput(inputRef?.current?.value);
  };
  const handleClickApply = (coupon, shopId) => {
    if (onSubmit) onSubmit(coupon, shopId);
    handleClose();
  };

  //Display contents
  let coupons;
  let shippingCoupons;
  let topCoupon;

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
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            margin: "5px 0",
            borderRadius: "5px",
            height: { xs: 85, sm: 155 },
          }}
        />
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

          return (
            <CouponItem
              key={`coupon-${id}-${index}`}
              {...{
                coupon,
                summary,
                selectMode,
                isDisabled,
                isSelected,
                onClickApply: setTempCoupon,
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
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            margin: "5px 0",
            borderRadius: "5px",
            height: { xs: 85, sm: 155 },
          }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            margin: "5px 0",
            borderRadius: "5px",
            height: { xs: 85, sm: 155 },
          }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            margin: "5px 0",
            borderRadius: "5px",
            height: { xs: 85, sm: 155 },
          }}
        />
      </>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    coupons = ids?.length ? (
      <>
        <DetailTitle>Mã giảm giá</DetailTitle>
        {ids?.map((id, index) => {
          const coupon = entities[id];
          const summary = couponTypes[coupon?.type];
          const isDisabled = selectMode && !coupon.isUsable;
          const isSelected = tempCoupon?.id == id;

          return (
            <CouponItem
              key={`coupon-${id}-${index}`}
              {...{
                coupon,
                summary,
                selectMode,
                isDisabled,
                isSelected,
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

    // console.log(currCoupon)

    // console.log(selectMode && (!currCoupon?.isUsable || currCoupon?.shopId != shopId))

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
      <DialogTitle>
        <TitleContainer>
          <Loyalty />
          &nbsp;Thông tin ưu đãi
        </TitleContainer>
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
          {shippingCoupons}
          {coupons}
          {!coupons && !shippingCoupons && (
            <Box display="flex" alignItems="center" justifyContent="center">
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

export default CouponDialog;
