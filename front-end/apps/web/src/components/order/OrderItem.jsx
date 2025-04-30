import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";
import {
  DeliveryDiningOutlined,
  KeyboardArrowRight,
  Payment,
  Storefront,
} from "@mui/icons-material";
import { currencyFormat, getOrderStatus } from "@ring/shared";
import { Link } from "react-router";
import {
  ItemTitle,
  Shop,
  ShopTag,
  DetailText,
  ContentContainer,
  HeadContainer,
  BodyContainer,
  StyledLazyImage,
  StyledSkeleton,
  StatusTag,
} from "../custom/OrderComponents";

//#region styled
const Amount = styled.span`
  font-size: 14px;
  font-weight: 450;
  margin-right: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.text.secondary};

  b {
    color: ${({ theme }) => theme.palette.warning.main};
  }
`;

const StuffContainer = styled.div`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down("md")} {
    align-items: flex-end;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: row-reverse;
  }
`;

const PriceContainer = styled.div``;

const Price = styled.p`
  font-size: 16px;
  font-weight: 450;
  text-align: left;
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 0;

  &.total {
    color: ${({ theme }) => theme.palette.warning.light};
  }
`;

const Discount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.disabled};
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  text-decoration: line-through;
`;

const OrderItemContainer = styled.div`
  border: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.action.focus};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const BotContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.action.focus};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
    font-size: 14px;
    align-items: flex-start;
  }
`;

const MainButton = styled(Button)`
  min-width: 200px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    min-width: 150px;
  }
`;
//#endregion

const OrderStatus = getOrderStatus();

const OrderItem = ({ order, handleAddToCart, handleCancelOrder }) => {
  const detailStatus = OrderStatus[order?.status];

  return (
    <OrderItemContainer>
      <HeadContainer>
        <Link to={`/shops/${order?.shopId}`}>
          <Shop>
            <ShopTag>Đối tác</ShopTag>
            <Storefront />
            &nbsp;{order?.shopName}
            <KeyboardArrowRight fontSize="small" />
          </Shop>
        </Link>
        <Link to={`/profile/order/detail/${order?.id}`}>
          <StatusTag color={detailStatus?.color}>
            {detailStatus?.label}
          </StatusTag>
        </Link>
      </HeadContainer>
      {order?.items?.map((item, itemIndex) => (
        <Link
          key={`item-${item?.id}-${itemIndex}`}
          to={`/profile/order/detail/${order?.id}`}
        >
          <BodyContainer
            className={
              order?.status == OrderStatus.CANCELED.value ||
              order?.status == OrderStatus.REFUNDED.value
                ? "disabled"
                : ""
            }
          >
            <StyledLazyImage
              src={item?.image}
              alt={`${item?.bookTitle} Order item`}
              placeholder={
                <StyledSkeleton variant="rectangular" animation={false} />
              }
            />
            <ContentContainer>
              <ItemTitle>{item?.bookTitle}</ItemTitle>
              <StuffContainer>
                <Amount>
                  Số lượng: <b>{item?.quantity}</b>
                </Amount>
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
              </StuffContainer>
            </ContentContainer>
          </BodyContainer>
        </Link>
      ))}
      <BotContainer>
        {order?.status == OrderStatus.PENDING_PAYMENT.value ? (
          <Link
            to={`/profile/order/checkout/${order?.orderId}`}
            style={{ color: "inherit", display: "flex", alignItems: "center" }}
          >
            <DetailText>
              <Payment />
              &nbsp;Chi tiết thanh toán
            </DetailText>
          </Link>
        ) : (
          <Link
            to={`/profile/order/detail/${order?.id}`}
            style={{ color: "inherit", display: "flex", alignItems: "center" }}
          >
            <DetailText>
              <DeliveryDiningOutlined />
              &nbsp;Chi tiết đơn hàng
            </DetailText>
          </Link>
        )}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: "5px",
            }}
          >
            <p style={{ margin: 0 }}>Thành tiền:</p>
            <Price className="total">
              &nbsp;
              {currencyFormat.format(
                order?.totalPrice + order?.shippingFee - order?.totalDiscount
              )}
            </Price>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {order?.status == OrderStatus.PENDING.value ? (
              <MainButton
                variant="outlined"
                color="error"
                onClick={() => handleCancelOrder(order)}
              >
                Huỷ đơn hàng
              </MainButton>
            ) : order?.status == OrderStatus.PENDING_PAYMENT.value ? (
              <Link to={`/payment/${order?.orderId}`}>
                <MainButton variant="contained" color="info">
                  Thanh toán
                </MainButton>
              </Link>
            ) : (
              <MainButton
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(order)}
              >
                Mua lại
              </MainButton>
            )}
          </Box>
        </Box>
      </BotContainer>
    </OrderItemContainer>
  );
};

export default OrderItem;
