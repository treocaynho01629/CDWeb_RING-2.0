import styled from "@emotion/styled";
import {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import {
  LocationOn,
  CreditCard,
  KeyboardDoubleArrowDown,
  ShoppingCartCheckout,
  ProductionQuantityLimits,
} from "@mui/icons-material";
import {
  TextareaAutosize,
  Button,
  Table,
  TableBody,
  TableContainer,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
  Grid2 as Grid,
  TextField,
} from "@mui/material";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router";
import { useGetMyAddressQuery } from "../features/addresses/addressesApiSlice";
import {
  useCalculateMutation,
  useCheckoutMutation,
} from "../features/orders/ordersApiSlice";
import {
  PHONE_REGEX,
  shippingType,
  paymentType,
  useTitle,
  useDeepEffect,
} from "@ring/shared";
import { useReCaptcha } from "@ring/auth";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";
import AddressDisplay from "../components/address/AddressDisplay";
import AddressSelectDialog from "../components/address/AddressSelectDialog";
import PreviewDetailRow from "../components/cart/PreviewDetailRow";
import FinalCheckoutDialog from "../components/cart/FinalCheckoutDialog";
import useCart from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout";
import { isEqual } from "lodash-es";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));
const ReCaptcha = lazy(() => import("@ring/auth/ReCaptcha"));
const CouponDialog = lazy(() => import("../components/coupon/CouponDialog"));
const PaymentSelect = lazy(() => import("../components/cart/PaymentSelect"));

//#region styled
const Wrapper = styled.div``;

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;
  padding: 20px 0px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 20px 10px;
  }
`;

const SemiTitle = styled.h4`
  font-size: 18px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  color: inherit;

  &.end {
    text-align: end;
    direction: rtl;

    ${({ theme }) => theme.breakpoints.down("md_lg")} {
      display: none;
    }
  }
`;

const MiniTitle = styled.h4`
  margin: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(1)}`};
  font-weight: 420;
`;

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  "& .MuiStepLabel-root": {
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1),
    },
  },
  "& .MuiStepLabel-root .Mui-completed": {
    color: theme.palette.success.main,
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },
  "& .MuiStepLabel-root .Mui-error": {
    color: theme.palette.error.main,
    textDecoration: "underline",
  },
  "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
    fill: theme.palette.text.main,
    fontWeight: "bold",
  },
}));

const StyledStepContent = styled(StepContent)(({ theme }) => ({
  paddingRight: 0,

  [theme.breakpoints.down("sm")]: {
    padding: 0,
    margin: 0,
    borderLeft: "none",
  },
}));
//#endregion

const Checkout = () => {
  //#region construct
  const scrollRef = useRef(null);
  const prevPayload = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const [delivery, setDelivery] = useState(shippingType[0]);
  const [payment, setPayment] = useState(paymentType[0]);

  const [pending, setPending] = useState(false);
  const maxSteps = 3;

  //Cart
  const { cartProducts, clearCart } = useCart();
  const { estimateCart, syncCart } = useCheckout();
  const { state: checkoutState } = useLocation();
  const selected = checkoutState?.selected;

  //Coupon
  const [openCoupon, setOpenCoupon] = useState(false);
  const [contextShop, setContextShop] = useState(null);
  const [contextState, setContextState] = useState(null);
  const [contextCoupon, setContextCoupon] = useState(null);
  const [coupon, setCoupon] = useState(checkoutState?.coupon || "");
  const [shopCoupon, setShopCoupon] = useState(checkoutState?.shopCoupon || "");
  const [discount, setDiscount] = useState(0);
  const [shopDiscount, setShopDiscount] = useState([]);
  const [checkState, setCheckState] = useState(null);

  //Address
  const [openAddress, setOpenAddress] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [validPhone, setValidPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState([]);

  //Price
  const [estimated, setEstimated] = useState({
    deal: 0,
    subTotal: 0,
    shipping: 0,
    total: 0,
  });
  const [calculated, setCalculated] = useState(null);
  const [calculate, { isLoading: calculating, isError }] =
    useCalculateMutation();

  //Recaptcha v2
  const [challenge, setChallenge] = useState(false); //Toggle if marked suspicious by v3
  const [token, setToken] = useState("");

  //Recaptcha
  const { reCaptchaLoaded, generateReCaptchaToken, hideBadge } = useReCaptcha();

  //Checkout hook
  const [checkout, { isLoading }] = useCheckoutMutation();

  //Fetch current profile address
  const { data: address, isLoading: loadAddress } = useGetMyAddressQuery();

  //Other
  const navigate = useNavigate();

  useEffect(() => {
    //Check phone number
    const result = PHONE_REGEX.test(addressInfo?.phone);
    setValidPhone(result);
  }, [addressInfo?.phone]);

  useDeepEffect(() => {
    handleCartChange();
  }, [cartProducts, shopCoupon, coupon, addressInfo, delivery]);

  useEffect(() => {
    scrollToTop();
  }, [activeStep]);

  useEffect(() => {
    hideBadge();
  }, [reCaptchaLoaded]); //Hide badge cuz it's in the way of stepper

  //Set title
  useTitle("Thanh toán");

  const handleCartChange = () => {
    if (selected.length > 0 && cartProducts.length > 0) {
      const checkoutCart = getCheckoutCart(); //Include address, shipping method, payment method ...
      handleEstimate(checkoutCart); //Estimate price
      handleCalculate(checkoutCart); //Calculate price
    } else {
      //Reset
      handleEstimate(null);
      handleCalculate(null);
      setCalculated(null);
    }
  };

  //Filter out unusable coupons
  const getCheckoutCart = () => {
    if (selected.length > 0 && cartProducts.length > 0) {
      //Reduce cart
      const checkoutCart = cartProducts.reduce(
        (result, item) => {
          const { id, shopId } = item;

          if (selected.indexOf(id) !== -1) {
            //Get selected items in redux store
            //Find or create shop
            let detail = result.cart.find(
              (shopItem) => shopItem.shopId === shopId
            );

            if (!detail) {
              const coupon = shopCoupon[shopId];
              detail = {
                shopId,
                items: [],
                coupon: coupon?.isUsable ? coupon?.code : null,
              };
              result.cart.push(detail);
            }

            //Add items for that shop
            detail.items.push(item);
          }

          return result;
        },
        {
          address: addressInfo
            ? {
                name: addressInfo.name,
                companyName: addressInfo.companyName,
                phone: addressInfo.phone,
                city: addressInfo.city + ", " + addressInfo.ward,
                address: addressInfo.address,
                type: addressInfo.type,
              }
            : null,
          paymentMethod: payment,
          shippingType: delivery,
          coupon: coupon?.isUsable ? coupon?.code : null,
          cart: [],
        }
      );

      return checkoutCart;
    } else {
      return null;
    }
  };

  const handleEstimate = useCallback(
    (cart) => {
      const result = estimateCart(cart);
      setCheckState(result.checkState);
      setEstimated(result.estimated);
    },
    [cartProducts]
  );

  //Calculate server side
  const handleCalculate = useCallback(async (cart) => {
    if (isLoading || cart == null || isEqual(prevPayload.current, cart)) return;

    calculate(cart)
      .unwrap()
      .then((data) => {
        setCalculated(data);
        handleSyncCart(data);
        prevPayload.current = cart;
      })
      .catch((err) => {
        console.error(err);
        if (!err?.status) {
          console.error("Server không phản hồi!");
        } else if (err?.status === 409) {
          console.error(err?.data?.message);
        } else if (err?.status === 400) {
          console.error("Sai định dạng giỏ hàng!");
        } else {
          console.error("Tính trước đơn hàng thất bại!");
        }
      });
  }, []);

  //Sync checkout cart between client and server
  const handleSyncCart = (cart) => {
    syncCart(
      cart,
      setDiscount,
      setShopDiscount,
      coupon,
      setCoupon,
      shopCoupon,
      setShopCoupon
    );
  };

  //Separate by shop
  const reduceCart = () => {
    let selectedCart = cartProducts.filter((product) =>
      selected.includes(product.id)
    );
    let resultCart = selectedCart.reduce((result, item) => {
      if (!result[item.shopId]) {
        //Check if not exists shop >> Add new one
        result[item.shopId] = { shopName: item.shopName, products: [] };
      }

      //Else push
      result[item.shopId].products.push(item);
      return result;
    }, {});

    return resultCart;
  };
  const reducedCart = useMemo(() => reduceCart(), [cartProducts]);
  const displayInfo = {
    deal:
      calculating || !calculated ? estimated?.deal : calculated?.dealDiscount,
    subTotal:
      calculating || !calculated
        ? estimated?.subTotal
        : calculated?.productsTotal,
    shipping:
      calculating || !calculated
        ? estimated?.shipping
        : calculated?.shippingFee,
    couponDiscount: calculated?.couponDiscount || 0,
    totalDiscount: calculated?.totalDiscount || 0,
    shippingDiscount: calculated?.shippingDiscount || 0,
    total:
      calculating || !calculated
        ? estimated?.total
        : calculated?.total - calculated?.totalDiscount,
  };

  const scrollToTop = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const backFirstStep = () => {
    setActiveStep(0);
  };

  const handleOpenDialog = () => {
    setOpenAddress(true);
  };
  const handleCloseDialog = () => {
    setOpenAddress(false);
  };
  const handleOpenCouponDialog = (shopId) => {
    setOpenCoupon(true);
    setContextShop(shopId);
    setContextState(
      shopId
        ? checkState?.details[shopId]
        : { value: checkState?.value, quantity: checkState?.quantity }
    );
    setContextCoupon(shopId ? shopCoupon[shopId] : coupon);
  };
  const handleCloseCouponDialog = () => {
    setOpenCoupon(false);
    setContextShop(null);
    setContextState(null);
    setContextCoupon(null);
  };

  const handleChangeCoupon = (coupon, shopId) => {
    if (shopId) {
      setShopCoupon((prev) => ({ ...prev, [shopId]: coupon }));
    } else {
      setCoupon(coupon);
    }
  };

  const handleChangeMethod = (e) => {
    setPayment(e.target.value);
  };

  const handleChangeShipping = (e) => {
    setDelivery(e.target.value);
  };

  const validAddressInfo = [
    addressInfo?.name,
    addressInfo?.phone,
    addressInfo?.city,
    addressInfo?.address,
    validPhone,
  ].every(Boolean);

  //Submit checkout
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || calculating || pending) return;
    setPending(true);

    //Validation
    const valid = PHONE_REGEX.test(addressInfo?.phone);

    if (!valid && addressInfo?.phone) {
      setErrMsg("Sai định dạng số điện thoại!");
      return;
    } else if (
      !addressInfo?.name ||
      !addressInfo?.phone ||
      !addressInfo?.city ||
      !addressInfo?.address
    ) {
      setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    const { enqueueSnackbar } = await import("notistack");
    const checkoutCart = getCheckoutCart();

    const recaptchaToken = challenge
      ? token
      : await generateReCaptchaToken("checkout");
    checkout({
      token: recaptchaToken,
      source: challenge ? "v2" : "v3",
      cart: checkoutCart,
    })
      .unwrap()
      .then((data) => {
        enqueueSnackbar("Đặt hàng thành công!", { variant: "success" });
        clearCart();
        navigate("/cart", { replace: true });
        setChallenge(false);
        setPending(false);
      })
      .catch((err) => {
        enqueueSnackbar("Đặt hàng thất bại!", { variant: "error" });
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg("Server không phản hồi!");
        } else if (err?.status === 409) {
          setErrMsg(err?.data?.message);
        } else if (err?.status === 403) {
          setErrMsg("Lỗi xác thực!");
        } else if (err?.status === 412) {
          setChallenge(true);
          setErrMsg("Yêu cầu của bạn cần xác thực lại!");
        } else if (err?.status === 400) {
          setErrMsg("Sai định dạng thông tin!");
        } else {
          setErrMsg("Đặt hàng thất bại!");
        }
        setPending(false);
      });
  };
  //#endregion

  if (selected?.length) {
    return (
      <Wrapper>
        {(isLoading || pending) && (
          <Suspense fallBack={null}>
            <PendingModal
              open={isLoading || pending}
              message="Đang xử lý đơn hàng..."
            />
          </Suspense>
        )}
        <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
          <NavLink to={"/cart"}>Giỏ hàng</NavLink>
          <NavLink to={"/checkout"}>Thanh toán</NavLink>
        </CustomBreadcrumbs>
        <CheckoutContainer>
          <Title ref={scrollRef}>
            <ShoppingCartCheckout />
            &nbsp;THANH TOÁN
          </Title>
          <Grid
            container
            spacing={2}
            sx={{ position: "relative", mb: 10, justifyContent: "flex-end" }}
          >
            <Grid size={{ xs: 12, md_lg: 8 }} position="relative">
              <StyledStepper
                activeStep={activeStep}
                orientation="vertical"
                connector={null}
              >
                <Step key={0}>
                  <StepLabel
                    error={errMsg !== "" && err?.status}
                    optional={
                      errMsg !== "" &&
                      err?.status && (
                        <Typography variant="caption" color="error">
                          {errMsg}
                        </Typography>
                      )
                    }
                  >
                    <SemiTitle
                      onClick={() => {
                        if (activeStep > 0) setActiveStep(0);
                      }}
                    >
                      <LocationOn />
                      &nbsp;Địa chỉ người nhận
                    </SemiTitle>
                  </StepLabel>
                  <StyledStepContent>
                    <AddressDisplay
                      {...{
                        addressInfo,
                        isValid: validAddressInfo,
                        handleOpen: handleOpenDialog,
                        loadAddress,
                        value: delivery,
                        handleChange: handleChangeShipping,
                      }}
                    />
                    <AddressSelectDialog
                      {...{
                        address,
                        pending,
                        setPending,
                        setAddressInfo,
                        openDialog: openAddress,
                        handleCloseDialog,
                      }}
                    />
                    <Button
                      disabled={!validAddressInfo}
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      sx={{ my: 1, display: { xs: "none", sm: "flex" } }}
                      endIcon={<KeyboardDoubleArrowDown />}
                    >
                      Vận chuyển đến địa chỉ này
                    </Button>
                  </StyledStepContent>
                </Step>
                <Step key={1}>
                  <StepLabel
                    error={
                      errMsg !== "" &&
                      (err?.status == 409 || err?.status == 404)
                    }
                    optional={
                      errMsg !== "" &&
                      (err?.status == 409 || err?.status == 404) && (
                        <Typography variant="caption" color="error">
                          {errMsg}
                        </Typography>
                      )
                    }
                  >
                    <SemiTitle
                      onClick={() => {
                        if (validAddressInfo && activeStep > 1)
                          setActiveStep(1);
                      }}
                    >
                      <ProductionQuantityLimits />
                      &nbsp;Kiểm tra lại sản phẩm
                    </SemiTitle>
                  </StepLabel>
                  <StyledStepContent TransitionProps={{ unmountOnExit: false }}>
                    <TableContainer>
                      <Table aria-label="checkout-table">
                        <TableBody>
                          {Object.keys(reducedCart).map((shopId, index) => {
                            const shop = reducedCart[shopId];

                            return (
                              <PreviewDetailRow
                                key={`preview-${shop?.shopId}-${index}`}
                                {...{
                                  shop: { ...shop, id: shopId },
                                  coupon: shopCoupon[shopId],
                                  discount: shopDiscount[shopId],
                                  handleOpenDialog: handleOpenCouponDialog,
                                }}
                              />
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <MiniTitle>Ghi chú khi giao hàng: </MiniTitle>
                    <TextField
                      margin="dense"
                      id="message"
                      placeholder="Nhập ghi chú cho đơn hàng ..."
                      fullWidth
                      multiline
                      minRows={6}
                      sx={{ bgcolor: "background.paper" }}
                      slotProps={{
                        inputComponent: TextareaAutosize,
                        inputProps: {
                          minRows: 6,
                          style: { resize: "auto" },
                        },
                      }}
                      variant="outlined"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                      disabled={!validAddressInfo || calculating}
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      sx={{ my: 1, display: { xs: "none", sm: "flex" } }}
                      endIcon={<KeyboardDoubleArrowDown />}
                    >
                      Tiếp tục
                    </Button>
                  </StyledStepContent>
                </Step>
                <Step key={2}>
                  <StepLabel
                    error={
                      errMsg !== "" &&
                      (err?.status == 412 || err?.status == 403)
                    }
                    optional={
                      errMsg !== "" &&
                      (err?.status == 412 || err?.status == 404) && (
                        <Typography variant="caption" color="error">
                          {errMsg}
                        </Typography>
                      )
                    }
                  >
                    <SemiTitle>
                      <CreditCard />
                      &nbsp;Chọn hình thức thanh toán
                    </SemiTitle>
                  </StepLabel>
                  <StyledStepContent>
                    <Suspense fallback={null}>
                      {activeStep == 2 && (
                        <PaymentSelect
                          {...{
                            value: payment,
                            handleChange: handleChangeMethod,
                          }}
                        />
                      )}
                    </Suspense>
                    {reCaptchaLoaded && challenge && (
                      <Suspense fallback={null}>
                        <ReCaptcha onVerify={(token) => setToken(token)} />
                      </Suspense>
                    )}
                  </StyledStepContent>
                </Step>
              </StyledStepper>
            </Grid>
            <Grid
              size={{ xs: 12, md_lg: 4 }}
              position={{ xs: "sticky", md_lg: "relative" }}
              bottom={0}
            >
              <Box py={2}>
                <SemiTitle className="end">Tổng quan</SemiTitle>
              </Box>
              <FinalCheckoutDialog
                {...{
                  coupon,
                  shopCoupon,
                  discount,
                  calculating,
                  displayInfo,
                  isValid: validAddressInfo,
                  activeStep,
                  maxSteps,
                  handleOpenDialog: handleOpenCouponDialog,
                  addressInfo,
                  backFirstStep,
                  handleNext,
                  handleSubmit,
                  reCaptchaLoaded,
                }}
              />
            </Grid>
          </Grid>
        </CheckoutContainer>
        <Suspense fallback={null}>
          {openCoupon !== undefined && (
            <CouponDialog
              {...{
                open: openCoupon,
                handleClose: handleCloseCouponDialog,
                shopId: contextShop,
                checkState: contextState,
                selectedCoupon: contextCoupon,
                numSelected: selected.length,
                selectMode: true,
                onSubmit: handleChangeCoupon,
              }}
            />
          )}
        </Suspense>
      </Wrapper>
    );
  } else {
    return <Navigate to={"/cart"} />;
  }
};

export default Checkout;
