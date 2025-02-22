import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";
import {
  DeliveryDiningOutlined,
  KeyboardArrowRight,
  Storefront,
} from "@mui/icons-material";
import { orderTypes, currencyFormat } from "@ring/shared";
import { Link } from "react-router";
import {
  ItemTitle,
  Shop,
  ShopTag,
  StatusTag,
  DetailText,
  ContentContainer,
  StuffContainer,
  HeadContainer,
  BodyContainer,
  StyledLazyImage,
  StyledSkeleton,
} from "../custom/OrderComponents";

//#region styled
const Amount = styled.span`
  font-size: 14px;
  font-weight: 450;
  margin-right: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.palette.text.secondary};

  b {
    color: ${(props) => props.theme.palette.warning.main};
  }
`;

const PriceContainer = styled.div``;

const Price = styled.p`
  font-size: 16px;
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
`;

const OrderItemContainer = styled.div`
  border: 0.5px solid;
  border-color: ${(props) => props.theme.palette.action.focus};
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const BotContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)};
  border-top: 0.5px solid;
  border-color: ${(props) => props.theme.palette.action.focus};

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(1)};
    font-size: 14px;
    align-items: flex-start;
  }
`;
//#endregion

const OrderItem = ({ order, handleAddToCart, handleCancelOrder }) => {
  const detailStatus = orderTypes[order?.status];

  return (
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
        <Link to={`/profile/order/detail/${order?.id}`}>
          <StatusTag color={detailStatus.color}>{detailStatus.label}</StatusTag>
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
        <Link
          to={`/profile/order/detail/${order?.id}`}
          style={{ color: "inherit", display: "flex", alignItems: "center" }}
        >
          <DetailText>
            <DeliveryDiningOutlined />
            &nbsp;Chi tiết đơn hàng
          </DetailText>
        </Link>
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
              {currencyFormat.format(order?.totalPrice - order?.totalDiscount)}
            </Price>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {order?.status == orderTypes.PENDING.value ||
            order?.status == orderTypes.SHIPPING.value ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelOrder(order)}
              >
                Huỷ đơn hàng
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(order)}
              >
                Mua lại
              </Button>
            )}
          </Box>
        </Box>
      </BotContainer>
    </OrderItemContainer>
  );
};

export default OrderItem;
