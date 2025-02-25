import styled from "@emotion/styled";
import { Suspense, lazy } from "react";
import { StyledDialogTitle } from "../custom/ProfileComponents";
import {
  Button,
  DialogContent,
  Box,
  Typography,
  Grid2 as Grid,
  Skeleton,
  Dialog,
} from "@mui/material";
import {
  Close,
  Inbox,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardReturn,
  Receipt,
  Sell,
} from "@mui/icons-material";
import {
  currencyFormat,
  dateFormatter,
  idFormatter,
  orderTypes,
  shippingTypes,
  timeFormatter,
} from "@ring/shared";
import { Link } from "react-router";
import { useCancelOrderMutation } from "../../features/orders/ordersApiSlice";
import { booksApiSlice } from "../../features/books/booksApiSlice";
import OrderReceipt from "./OrderReceipt";
import { MobileExtendButton } from "@ring/ui/Components";

const OrderProgress = lazy(() => import("./OrderProgress"));

//#region styled
const TitleContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.secondary};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const SubText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: ${({ theme }) => theme.spacing(1)} 0;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 0.5px dashed ${({ theme }) => theme.palette.divider};
  border-bottom: 0.5px dashed ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(2)} 0;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  font-size: 16px;
  font-weight: 450;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`;

const Name = styled.p`
  font-size: 17px;
  font-weight: 450;
  margin: 0 0 ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 15px;
  }
`;

const ShippingTag = styled.span`
  display: flex;
  align-items: center;
  font-weight: 450;
  color: ${({ theme, color }) =>
    theme.palette[color]?.dark || theme.palette.primary.dark};
`;

const StuffContainer = styled.div`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down("md")} {
    align-items: flex-end;
  }
`;

const ContentWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(2)} 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)} 0;
  }
`;

const InfoContainer = styled.div`
  height: 100%;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
  }
`;

const InfoText = styled.span`
  font-size: 16px;
  line-height: 1.75em;
  display: flex;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  color: ${({ theme }) => theme.palette.text.secondary};

  &.price {
    margin: 0;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;

    &.price {
      display: none;
    }
  }
`;

const StatusTag = styled(Typography)`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 450;
  border-radius: 20px;
  border: 0.5px solid currentColor;
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    display: none;
  }
`;

const MainButton = styled(Button)`
  min-width: 200px;
`;

const ButtonContainer = styled.div`
  padding: 0 ${({ theme }) => theme.spacing(1)};
  margin: ${({ theme }) => `${theme.spacing(1)} 0 ${theme.spacing(6)}`};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
`;

const MobileButton = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing(1)} 0;

  span {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: 15px;
  }
`;

const MainButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
  border-bottom: none;
  padding: ${({ theme }) => `${theme.spacing(2.5)} ${theme.spacing(2)}`};
  margin-left: ${({ theme }) => `calc(${theme.spacing(-1.5)} - 0.5px)`};
  background-color: ${({ theme }) => theme.palette.background.paper};
  display: flex;
  width: 100%;
  z-index: 2;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    left: 0;
    height: 50px;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: ${({ theme }) => theme.shadows[12]};
    align-items: flex-end;
  }

  ${({ theme }) => theme.breakpoints.up("sm_md")} {
    width: 720px;
  }
`;
//#endregion

function getDetailSummary(detail) {
  const date = new Date(detail?.date);

  switch (detail?.status) {
    case orderTypes.PENDING.value:
      return {
        step: 1,
        summary: "Đang chờ nhận hàng từ shop.",
      };
    case orderTypes.SHIPPING.value:
      return {
        step: 2,
        summary: "Đang giao hàng cho đơn vị vận chuyển.",
      };
    case orderTypes.PENDING_REFUND.value:
      return {
        step: 3,
        summary: "Đang chờ hoàn trả hàng.",
      };
    case orderTypes.COMPLETED.value:
      return {
        step: 4,
        summary: "Cảm ơn bạn đã mua hàng!",
      };
    case orderTypes.CANCELED.value:
      return {
        step: 1,
        summary: `Đã huỷ đơn vào ${timeFormatter(date)} ${dateFormatter(date)}.`,
      };
    case orderTypes.REFUNDED.value:
      return {
        step: 4,
        summary: `Đã hoàn trả ${currencyFormat.format(detail?.totalPrice - detail?.totalDiscount)} vào tài khoản vào ${timeFormatter(date)} ${dateFormatter(date)}.`,
      };
  }
}

const OrderDetailComponent = ({
  order,
  pending,
  setPending,
  isLoading,
  tabletMode,
  mobileMode,
}) => {
  const detailStatus = orderTypes[order?.status];
  const [getBought, { isLoading: fetching }] =
    booksApiSlice.useLazyGetBooksByIdsQuery();
  const [cancel, { isLoading: canceling }] = useCancelOrderMutation();

  //Rebuy
  const handleAddToCart = async (detail) => {
    if (canceling || fetching || pending) return;
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    const ids = detail?.items?.map((item) => item.bookId);
    getBought(ids) //Fetch books with new info
      .unwrap()
      .then((books) => {
        const { ids, entities } = books;

        ids.forEach((id) => {
          const book = entities[id];
          if (book.amount > 0) {
            //Check for stock
            addProduct(book, 1);
          } else {
            enqueueSnackbar("Sản phẩm đã hết hàng!", { variant: "error" });
          }
        });
        setPending(false);
      })
      .catch((rejected) => {
        console.error(rejected);
        enqueueSnackbar("Mua lại sản phẩm thất bại!", { variant: "error" });
        setPending(false);
      });
  };

  //Cancel
  const handleCancelOrder = async (detail) => {
    if (canceling || fetching || pending) return;
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    cancel(detail?.id)
      .unwrap()
      .then((data) => {
        enqueueSnackbar("Huỷ đơn hàng thành công!", { variant: "success" });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Huỷ đơn hàng thất bại!", { variant: "error" });
        setPending(false);
      });
  };

  const detailSummary = getDetailSummary(order);
  const orderedDate = new Date(order?.orderedDate);
  const date = new Date(order?.date);
  const shippingSummary = shippingTypes[order?.shippingType];

  return (
    <>
      <StyledDialogTitle>
        <TitleContainer>
          <Link to={"/profile/order"}>
            <KeyboardArrowLeft />
          </Link>
          <Receipt />
          &nbsp;Mã vận đơn&nbsp;
          {isLoading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            idFormatter(order?.orderId)
          )}
          &emsp;
          {isLoading ? (
            <StatusTag color="secondary">Đang tải</StatusTag>
          ) : (
            <StatusTag color={detailStatus?.color}>
              {detailStatus?.label}
            </StatusTag>
          )}
        </TitleContainer>
        <SubTitle>
          {isLoading ? (
            <Skeleton variant="text" width={130} />
          ) : (
            `${timeFormatter(orderedDate)} ${dateFormatter(orderedDate)}`
          )}
        </SubTitle>
      </StyledDialogTitle>
      <DialogContent sx={{ px: { xs: 0, sm: 2, md: 0 }, mt: { xs: 1, md: 0 } }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{
              height: { xs: 71, md: 169 },
              width: { xs: "90%", md: "100%" },
              mt: { xs: 1, md: 0 },
              mx: "auto",
              mb: 1,
            }}
          />
        ) : (
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                sx={{
                  height: { xs: 71, md: 169 },
                  width: { xs: "90%", md: "100%" },
                  mt: { xs: 1, md: 0 },
                  mx: "auto",
                  mb: 1,
                }}
              />
            }
          >
            <OrderProgress
              {...{
                order,
                detailSummary,
                detailStatus,
                orderedDate,
                date,
                tabletMode,
              }}
            />
          </Suspense>
        )}
        {tabletMode ? (
          <MainButtonContainer>
            {isLoading ? (
              <MainButton
                disabled
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
              >
                Đang tải
              </MainButton>
            ) : order?.status == orderTypes.PENDING.value ||
              order?.status == orderTypes.SHIPPING.value ? (
              <MainButton
                variant="contained"
                color="success"
                size="large"
                fullWidth
                onClick={() => handleCancelOrder(order)}
              >
                Đã nhận hàng
              </MainButton>
            ) : (
              <MainButton
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => handleAddToCart(order)}
              >
                Mua lại
              </MainButton>
            )}
          </MainButtonContainer>
        ) : (
          <SummaryContainer>
            <Box>
              <SubText>
                {isLoading ? (
                  <Skeleton variant="text" width={280} />
                ) : (
                  detailSummary?.summary
                )}
              </SubText>
            </Box>
            <Box>
              {isLoading ? (
                <MainButton
                  disabled
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  Đang tải
                </MainButton>
              ) : order?.status == orderTypes.PENDING.value ||
                order?.status == orderTypes.SHIPPING.value ? (
                <>
                  <MainButton
                    variant="contained"
                    color="success"
                    size="large"
                    fullWidth
                    onClick={() => handleCancelOrder(order)}
                  >
                    Đã nhận hàng
                  </MainButton>
                  <MainButton
                    variant="outlined"
                    color="error"
                    size="large"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => handleCancelOrder(order)}
                  >
                    Huỷ đơn hàng
                  </MainButton>
                </>
              ) : (
                <>
                  <MainButton
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => handleAddToCart(order)}
                  >
                    Mua lại
                  </MainButton>
                  {order?.status == orderTypes.COMPLETED.value && (
                    <MainButton
                      variant="outlined"
                      color="warning"
                      size="large"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => handleAddToCart(order)}
                    >
                      Hoàn trả hàng
                    </MainButton>
                  )}
                </>
              )}
            </Box>
          </SummaryContainer>
        )}
        <ContentWrapper>
          <Title>
            <Sell />
            &nbsp;Địa chỉ người nhận
          </Title>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md_lg: 6 }}>
              <InfoContainer>
                <div>
                  <Name>
                    {isLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      (order?.companyName ?? order?.name) + " "
                    )}
                  </Name>
                  <InfoText>
                    {isLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      `(+84) ${order?.phone}`
                    )}
                  </InfoText>
                </div>
                <InfoText>
                  {isLoading ? (
                    <Box width="100%">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="30%" />
                    </Box>
                  ) : (
                    (order?.address ?? "Không xác định")
                  )}
                </InfoText>
              </InfoContainer>
            </Grid>
            <Grid size={{ xs: 12, md_lg: 6 }}>
              <InfoContainer>
                <Box mb={1}>
                  <Name>Hình thức giao hàng:</Name>
                  <InfoText>
                    {isLoading ? (
                      <Skeleton variant="text" width={200} />
                    ) : (
                      <>
                        <ShippingTag color={shippingSummary?.color}>
                          {shippingSummary?.icon} {shippingSummary?.label}:
                        </ShippingTag>
                        &nbsp;{shippingSummary?.description}
                      </>
                    )}
                  </InfoText>
                  <InfoText className="price">
                    {isLoading ? (
                      <Skeleton variant="text" width={190} />
                    ) : (
                      `Phí vận chuyển ${currencyFormat.format(shippingSummary?.price)}`
                    )}
                  </InfoText>
                </Box>
              </InfoContainer>
            </Grid>
            {order?.message && (
              <Grid size={12}>
                <InfoContainer>
                  <Name>Ghi chú:</Name>
                  <InfoText>{order?.message}</InfoText>
                </InfoContainer>
              </Grid>
            )}
          </Grid>
        </ContentWrapper>
        <Title>
          <Inbox />
          &nbsp;Kiện hàng
        </Title>
        <OrderReceipt {...{ order, isLoading, tabletMode }} />
        <ButtonContainer>
          {order?.status == orderTypes.PENDING.value ||
          order?.status == orderTypes.SHIPPING.value ? (
            <MobileButton>
              <span>
                <Close fontSize="small" color="error" />
                &nbsp;Huỷ đơn hàng
              </span>
              <MobileExtendButton>
                <KeyboardArrowRight fontSize="small" />
              </MobileExtendButton>
            </MobileButton>
          ) : (
            order?.status == orderTypes.COMPLETED.value && (
              <MobileButton>
                <span>
                  <KeyboardReturn fontSize="small" color="warning" />
                  &nbsp;Hoàn trả đơn hàng
                </span>
                <MobileExtendButton>
                  <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
              </MobileButton>
            )
          )}
        </ButtonContainer>
      </DialogContent>
    </>
  );
};

export default OrderDetailComponent;
