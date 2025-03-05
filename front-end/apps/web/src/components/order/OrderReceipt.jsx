import styled from "@emotion/styled";
import {
  Button,
  Typography,
  Divider,
  Collapse,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
  Storefront,
} from "@mui/icons-material";
import {
  currencyFormat,
  idFormatter,
  orderTypes,
  paymentTypes,
} from "@ring/shared";
import { Link } from "react-router";
import {
  ItemTitle,
  Shop,
  ShopTag,
  ContentContainer,
  HeadContainer,
  BodyContainer,
  StyledLazyImage,
  StyledSkeleton,
  ToggleArrow,
} from "../custom/OrderComponents";
import { useState } from "react";
import {
  LoadContainer,
  PlaceholderContainer,
} from "../custom/ProfileComponents";

//#region styled
const OrderItemContainer = styled.div`
  border: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.action.focus};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 0;
  }
`;

const StuffContainer = styled.div`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down("md")} {
    align-items: flex-end;
  }
`;

const ItemsContainer = styled.div``;

const BotContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing(2)};
  border-top: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.action.focus};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
    font-size: 14px;
    align-items: flex-start;
  }
`;

const FinalPriceContainer = styled.div`
  width: 100%;
  max-width: 400px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    max-width: 100%;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(0.75)} 0;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: ${({ theme }) => theme.spacing(0.5)} 0;
  }
`;

const PriceText = styled.span`
  font-size: 16px;
  font-weight: 450;
  white-space: nowrap;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};

  &.secondary {
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &.discount {
    color: ${({ theme }) => theme.palette.success.dark};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

const FinalPrice = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.error.main};
  display: flex;
  align-items: center;
  cursor: pointer;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
`;

const PriceContainer = styled.div`
  ${({ theme }) => theme.breakpoints.down("md")} {
    display: flex;
  }
`;

const Price = styled.p`
  font-size: 15px;
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

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`;

const Amount = styled.span`
  font-size: 14px;
  font-weight: 350;
  color: ${({ theme }) => theme.palette.text.secondary};

  b {
    color: ${({ theme }) => theme.palette.warning.main};
  }

  &.mobile {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;

    &.mobile {
      display: block;
    }
  }
`;
//#endregion

const OrderReceipt = ({ order, tabletMode }) => {
  const [open, setOpen] = useState(false);
  const paymentSummary = paymentTypes[order?.paymentType];

  const togglePrice = () => {
    setOpen((prev) => !prev);
  };

  return (
    <ItemsContainer>
      <OrderItemContainer>
        <HeadContainer>
          {!order ? (
            <>
              <Shop>
                <Skeleton variant="text" width={200} />
              </Shop>
              <Typography variant="caption" color="secondary">
                <Skeleton variant="text" width={50} />
              </Typography>
            </>
          ) : (
            <>
              <Link to={`/store/${order?.shopId}`}>
                <Shop>
                  <ShopTag>Đối tác</ShopTag>
                  <Storefront />
                  &nbsp;{order?.shopName}
                  <KeyboardArrowRight fontSize="small" />
                </Shop>
              </Link>
              <Typography variant="caption" color="secondary">
                {idFormatter(order?.id)}
              </Typography>
            </>
          )}
        </HeadContainer>
        {!order ? (
          <PlaceholderContainer>
            <LoadContainer>
              <CircularProgress color="primary" />
            </LoadContainer>
          </PlaceholderContainer>
        ) : (
          order?.items?.map((item, itemIndex) => (
            <BodyContainer
              key={`item-${item?.id}-${itemIndex}`}
              className={
                order?.status == orderTypes.CANCELED.value ||
                order?.status == orderTypes.REFUNDED.value
                  ? "disabled"
                  : ""
              }
            >
              <Link to={`/product/${item?.bookSlug}`}>
                <StyledLazyImage
                  src={`${item?.image}?size=small`}
                  alt={`${item?.bookTitle} Order item`}
                  placeholder={
                    <StyledSkeleton variant="rectangular" animation={false} />
                  }
                />
              </Link>
              <ContentContainer>
                <Link to={`/product/${item?.bookSlug}`}>
                  <ItemTitle>{item?.bookTitle}</ItemTitle>
                </Link>
                <StuffContainer>
                  {order?.status == orderTypes.COMPLETED.value ? (
                    <div>
                      <Amount>
                        Số lượng: <b>{item?.quantity}</b>
                      </Amount>
                      <Link to={`/product/${item?.bookSlug}?review=true`}>
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          sx={{ mt: 0.5, minWidth: 100 }}
                        >
                          Đánh giá
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Amount>
                      Số lượng: <b>{item?.quantity}</b>
                    </Amount>
                  )}
                  <div>
                    <Amount className="mobile">
                      SL: <b>{item?.quantity}</b>
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
                  </div>
                </StuffContainer>
              </ContentContainer>
            </BodyContainer>
          ))
        )}
        <BotContainer>
          <FinalPriceContainer>
            <Collapse in={!tabletMode || open} timeout="auto" unmountOnExit>
              <PriceRow>
                <PriceText className="secondary">Tiền hàng:</PriceText>
                <PriceText>
                  {!order ? (
                    <Skeleton variant="text" width={90} />
                  ) : (
                    currencyFormat.format(order?.totalPrice)
                  )}
                </PriceText>
              </PriceRow>
              <PriceRow>
                <PriceText className="secondary">Phí vận chuyển:</PriceText>
                <PriceText>
                  {!order ? (
                    <Skeleton variant="text" width={85} />
                  ) : (
                    currencyFormat.format(order?.shippingFee)
                  )}
                </PriceText>
              </PriceRow>
              {order?.shippingDiscount > 0 && (
                <PriceRow>
                  <PriceText className="secondary">
                    Giảm phí vận chuyển:
                  </PriceText>
                  <PriceText className="discount">
                    {currencyFormat.format(-order?.shippingDiscount)}
                  </PriceText>
                </PriceRow>
              )}
              {order?.totalDiscount - order?.shippingDiscount > 0 && (
                <PriceRow>
                  <PriceText className="secondary">
                    Giảm từ mã giảm giá:
                  </PriceText>
                  <PriceText className="discount">
                    {currencyFormat.format(
                      -(order?.totalDiscount - order?.shippingDiscount)
                    )}
                  </PriceText>
                </PriceRow>
              )}
              <Divider sx={{ my: 1 }} />
            </Collapse>
            <PriceRow onClick={togglePrice}>
              <PriceText>Tổng:</PriceText>
              <FinalPrice color="primary">
                {!order ? (
                  <Skeleton variant="text" width={90} />
                ) : (
                  currencyFormat.format(
                    order?.totalPrice +
                      order?.shippingFee -
                      order?.totalDiscount
                  )
                )}
                <ToggleArrow>
                  {open ? (
                    <KeyboardArrowUp fontSize="small" />
                  ) : (
                    <KeyboardArrowDown fontSize="small" />
                  )}
                </ToggleArrow>
              </FinalPrice>
            </PriceRow>
            <Collapse in={!tabletMode || open} timeout="auto" unmountOnExit>
              <PriceRow>
                <PriceText className="secondary">
                  Hình thức thanh toán:
                </PriceText>
                <PriceText color="warning">
                  {!order ? (
                    <Skeleton variant="text" width={150} />
                  ) : (
                    paymentSummary?.label
                  )}
                </PriceText>
              </PriceRow>
            </Collapse>
          </FinalPriceContainer>
        </BotContainer>
      </OrderItemContainer>
    </ItemsContainer>
  );
};

export default OrderReceipt;
