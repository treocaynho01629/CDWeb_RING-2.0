import styled from "@emotion/styled";
import { StyledDialogTitle } from "../custom/ProfileComponents";
import { Button, DialogContent, Box } from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Receipt,
  Sell,
  Storefront,
} from "@mui/icons-material";
import {
  currencyFormat,
  dateFormatter,
  idFormatter,
  orderTypes,
  timeFormatter,
} from "@ring/shared";
import { Link } from "react-router";
import { useCancelOrderMutation } from "../../features/orders/ordersApiSlice";
import { booksApiSlice } from "../../features/books/booksApiSlice";
import {
  ItemTitle,
  Shop,
  ShopTag,
  StatusTag,
  ContentContainer,
  StuffContainer,
  HeadContainer,
  BodyContainer,
  StyledLazyImage,
  StyledSkeleton,
} from "../custom/OrderComponents";
import OrderProgress from "./OrderProgress";

//#region styled
const TitleContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 400;
  margin-left: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.palette.text.secondary};

  ${(props) => props.theme.breakpoints.down("md_lg")} {
    display: none;
  }
`;

const ErrorText = styled.span`
  font-size: 18px;
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.error.main};
`;

const SubText = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.palette.text.secondary};
  margin: ${(props) => props.theme.spacing(1)} 0;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 0.5px dashed ${(props) => props.theme.palette.divider};
  padding: ${(props) => props.theme.spacing(2)} 0;

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(1)} 0;
    font-size: 14px;
    align-items: flex-start;
  }
`;

const OrderItemContainer = styled.div`
  border: 0.5px solid;
  border-color: ${(props) => props.theme.palette.action.focus};
  margin-bottom: ${(props) => props.theme.spacing(2)};

  ${(props) => props.theme.breakpoints.down("md")} {
    border-left: none;
    border-right: none;
    margin-left: ${(props) => props.theme.spacing(-1)};
    margin-right: ${(props) => props.theme.spacing(-1)};
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 0.5px dashed ${(props) => props.theme.palette.divider};
  padding: ${(props) => props.theme.spacing(2)} 0;
`;

const Title = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing(1)};
  font-size: 16px;
  font-weight: 450;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
`;

const Name = styled.p`
  font-size: 17px;
  font-weight: 450;
  margin: 0 0 ${(props) => props.theme.spacing(1)};

  ${(props) => props.theme.breakpoints.down("sm")} {
    font-size: 15px;
  }
`;

const AddressContainer = styled.div`
  border: 0.5px solid ${(props) => props.theme.palette.action.hover};
  padding: ${(props) => props.theme.spacing(2)};
`;

const AddressContent = styled.div``;

const Address = styled.span`
  font-size: 16px;
  line-height: 1.75em;
  margin-top: ${(props) => props.theme.spacing(1)};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const ItemsContainer = styled.div``;

const CheckoutRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 0;
`;

const CheckoutText = styled.span`
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  color: ${(props) =>
    props.theme.palette[props.color]?.main || props.theme.palette.text.primary};
`;

const PriceContainer = styled.div`
  ${(props) => props.theme.breakpoints.down("md")} {
    display: flex;
  }
`;

const Price = styled.p`
  font-size: 15px;
  font-weight: 450;
  text-align: left;
  color: ${(props) => props.theme.palette.primary.main};
  margin: 0;

  &.total {
    color: ${(props) => props.theme.palette.warning.light};
  }
`;

const Discount = styled.p`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.disabled};
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  text-decoration: line-through;

  ${(props) => props.theme.breakpoints.down("md")} {
    margin-left: ${(props) => props.theme.spacing(1)};
  }
`;

const Amount = styled.span`
  font-size: 14px;
  font-weight: 350;
  color: ${(props) => props.theme.palette.text.secondary};

  b {
    color: ${(props) => props.theme.palette.warning.main};
  }

  &.mobile {
    display: none;
  }

  ${(props) => props.theme.breakpoints.down("md")} {
    display: none;

    &.mobile {
      display: block;
    }
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
        step: 2,
        summary: "Đang chờ hoàn trả hàng.",
      };
    case orderTypes.COMPLETED.value:
      return {
        step: 4,
        summary: "Cảm ơn bạn đã mua hàng.",
      };
    case orderTypes.CANCELED.value:
      return {
        step: 0,
        summary: `Đã huỷ đơn vào ${timeFormatter(date)} ${dateFormatter(date)}.`,
      };
    case orderTypes.REFUNDED.value:
      return {
        step: 3,
        summary: `Đã hoàn trả ${currencyFormat.format(detail?.totalPrice - detail?.totalDiscount)} vào tài khoản vào ${timeFormatter(date)} ${dateFormatter(date)}.`,
      };
  }
}

const OrderDetailComponent = ({ order, pending, setPending }) => {
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

  return (
    <>
      <StyledDialogTitle>
        <TitleContainer>
          <Link to={"/profile/order"}>
            <KeyboardArrowLeft />
          </Link>
          <Receipt />
          &nbsp;Mã vận đơn {idFormatter(order?.orderId)}
          <SubTitle>
            {timeFormatter(orderedDate)}&nbsp;{dateFormatter(orderedDate)}
          </SubTitle>
        </TitleContainer>
        <StatusTag color={detailStatus?.color}>{detailStatus?.label}</StatusTag>
      </StyledDialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: { xs: 1, md: 0 } }}>
        <OrderProgress {...{ order, detailSummary, orderedDate, date }} />
        <SummaryContainer>
          <Box>
            {order?.status == orderTypes.CANCELED.value ||
              (order?.status == orderTypes.REFUNDED.value && (
                <ErrorText>
                  {order?.status == orderTypes.CANCELED.value
                    ? "Đã huỷ đơn hàng"
                    : "Đã hoàn tiền"}
                </ErrorText>
              ))}
            <SubText>{detailSummary?.summary}</SubText>
          </Box>
          <Box>
            {order?.status == orderTypes.PENDING.value ||
            order?.status == orderTypes.SHIPPING.value ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCancelOrder(order)}
                >
                  Đã nhận hàng
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => handleCancelOrder(order)}
                >
                  Huỷ đơn hàng
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAddToCart(order)}
                >
                  Mua lại
                </Button>
                {order?.status == orderTypes.COMPLETED.value && (
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={() => handleAddToCart(order)}
                  >
                    Hoàn trả hàng
                  </Button>
                )}
              </>
            )}
          </Box>
        </SummaryContainer>
        <InfoContainer>
          <div>
            <Title>
              <Sell />
              &nbsp;ĐỊA CHỈ NGƯỜI NHẬN
            </Title>
            <AddressContainer>
              <AddressContent>
                <Name>{order?.companyName ?? order?.name}&nbsp;</Name>
                <Address>{`(+84) ${order?.phone}`}</Address>
              </AddressContent>
              <Address>{order?.address ?? "Không xác định"}</Address>
              <p>Hình thức vận:</p>
            </AddressContainer>
          </div>
          <div>
            <Title>CHI TIẾT VẬN HÀNG</Title>
            step tùm lum
          </div>
        </InfoContainer>
        <ItemsContainer>
          <OrderItemContainer>
            <HeadContainer>
              <Link to={`/store/${order?.shopId}`}>
                <Shop>
                  <ShopTag>Đối tác</ShopTag>
                  <Storefront />
                  &nbsp;{order?.shopName}
                  <KeyboardArrowRight fontSize="small" />
                </Shop>
              </Link>
            </HeadContainer>
            {order?.items?.map((item, itemIndex) => (
              <Link
                key={`item-${item?.id}-${itemIndex}`}
                to={`/product/${item?.bookSlug}`}
              >
                <BodyContainer
                  className={
                    order?.status == orderTypes.CANCELED.value ||
                    order?.status == orderTypes.REFUNDED.value
                      ? "disabled"
                      : ""
                  }
                >
                  <StyledLazyImage
                    src={`${item?.image}?size=small`}
                    alt={`${item?.bookTitle} Order item`}
                    placeholder={
                      <StyledSkeleton variant="rectangular" animation={false} />
                    }
                  />
                  <ContentContainer>
                    <ItemTitle>{item?.bookTitle}</ItemTitle>
                    <StuffContainer>
                      <div>
                        <Amount>
                          Số lượng: <b>{item?.quantity}</b>
                        </Amount>
                        {order?.status == orderTypes.COMPLETED.value && (
                          <Link to={`/product/${item?.bookSlug}?review=true`}>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              sx={{ mt: 0.5 }}
                            >
                              Đánh giá
                            </Button>
                          </Link>
                        )}
                      </div>
                      <div>
                        <PriceContainer>
                          <Price>
                            {currencyFormat.format(
                              item.price * (1 - (item?.discount || 0))
                            )}
                          </Price>
                          <Discount>
                            {item?.discount > 0
                              ? currencyFormat.format(item.price)
                              : ""}
                          </Discount>
                        </PriceContainer>
                        <Amount className="mobile">
                          SL: <b>{item?.quantity}</b>
                        </Amount>
                      </div>
                    </StuffContainer>
                  </ContentContainer>
                </BodyContainer>
              </Link>
            ))}
          </OrderItemContainer>
          <Box>
            <CheckoutRow>
              <CheckoutText>Tiền hàng:</CheckoutText>
              <CheckoutText>{currencyFormat.format(30000)}</CheckoutText>
            </CheckoutRow>
            <CheckoutRow>
              <CheckoutText>Phí vận chuyển:</CheckoutText>
              <CheckoutText>{currencyFormat.format(30000)}</CheckoutText>
            </CheckoutRow>
          </Box>
        </ItemsContainer>
      </DialogContent>
    </>
  );
};

export default OrderDetailComponent;
