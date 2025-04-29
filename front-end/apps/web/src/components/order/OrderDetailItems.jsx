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
  getOrderStatus,
  getPaymentType,
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
  OrderItemContainer,
  StuffContainer,
  BotContainer,
  FinalPriceContainer,
  PriceRow,
  PriceText,
  Amount,
  PriceContainer,
  FinalPrice,
  Price,
  Discount,
} from "../custom/OrderComponents";
import { useState } from "react";
import {
  LoadContainer,
  PlaceholderContainer,
} from "../custom/ProfileComponents";

const OrderStatus = getOrderStatus();
const PaymentType = getPaymentType();

const OrderDetailItems = ({ order, tabletMode }) => {
  const [open, setOpen] = useState(false);
  const paymentSummary = PaymentType[order?.paymentType];

  const togglePrice = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
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
              <Link to={`/shops/${order?.shopId}`}>
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
                order?.status == OrderStatus.CANCELED.value ||
                order?.status == OrderStatus.REFUNDED.value
                  ? "disabled"
                  : ""
              }
            >
              <Link to={`/product/${item?.bookSlug}`}>
                <StyledLazyImage
                  src={item?.image}
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
                  {order?.status == OrderStatus.COMPLETED.value ? (
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
    </div>
  );
};

export default OrderDetailItems;
