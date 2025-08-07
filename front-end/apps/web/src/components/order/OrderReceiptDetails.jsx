import { currencyFormat } from "@ring/shared/utils/convert";
import { getPaymentType } from "@ring/shared/enums/payment";
import { getOrderStatus } from "@ring/shared/enums/order";
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
  StatusTag,
} from "../custom/OrderComponents";
import { useState } from "react";
import {
  LoadContainer,
  PlaceholderContainer,
} from "../custom/ProfileComponents";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import Storefront from "@mui/icons-material/Storefront";

const PaymentType = getPaymentType();
const OrderStatus = getOrderStatus();

const OrderReceiptDetails = ({ receipt, tabletMode }) => {
  const [open, setOpen] = useState(false);
  const paymentSummary = PaymentType[receipt?.paymentType];

  const togglePrice = () => {
    setOpen((prev) => !prev);
  };

  const displayInfo = {
    subTotal: 0,
    shipping: 0,
    couponDiscount: 0,
    shippingDiscount: 0,
    total: 0,
  };

  return (
    <div>
      {receipt?.details?.map((detail, detailIndex) => {
        const detailStatus = OrderStatus[detail?.status];
        const couponDiscount = detail?.totalDiscount - detail?.shippingDiscount;
        displayInfo.subTotal += detail?.totalPrice;
        displayInfo.shipping += detail?.shippingFee;
        displayInfo.couponDiscount += couponDiscount > 0 ? couponDiscount : 0;
        displayInfo.shippingDiscount += detail?.shippingDiscount;

        return (
          <div key={`order-${detail?.id}-${detailIndex}`}>
            <OrderItemContainer>
              <HeadContainer>
                {!detail ? (
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
                    <Link to={`/shops/${detail?.shopId}`}>
                      <Shop>
                        <ShopTag>Đối tác</ShopTag>
                        <Storefront />
                        &nbsp;{detail?.shopName}
                        <KeyboardArrowRight fontSize="small" />
                      </Shop>
                    </Link>
                    <Link to={`/profile/order/detail/${detail?.id}`}>
                      <StatusTag color={detailStatus?.color}>
                        {detailStatus?.label}
                      </StatusTag>
                    </Link>
                  </>
                )}
              </HeadContainer>
              {!detail ? (
                <PlaceholderContainer>
                  <LoadContainer>
                    <CircularProgress color="primary" />
                  </LoadContainer>
                </PlaceholderContainer>
              ) : (
                detail?.items?.map((item, itemIndex) => (
                  <Link
                    key={`detail-${item?.id}-${itemIndex}`}
                    to={`/profile/order/detail/${detail?.id}`}
                  >
                    <BodyContainer
                      key={`item-${item?.id}-${itemIndex}`}
                      className={
                        detail?.status == OrderStatus.CANCELED.value ||
                        detail?.status == OrderStatus.REFUNDED.value
                          ? "disabled"
                          : ""
                      }
                    >
                      <StyledLazyImage
                        src={item?.image}
                        alt={`${item?.bookTitle} Order item`}
                        placeholder={
                          <StyledSkeleton
                            variant="rectangular"
                            animation={false}
                          />
                        }
                      />
                      <ContentContainer>
                        <ItemTitle>{item?.bookTitle}</ItemTitle>
                        <StuffContainer>
                          <Amount>
                            Số lượng: <b>{item?.quantity}</b>
                          </Amount>
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
                  </Link>
                ))
              )}
            </OrderItemContainer>
          </div>
        );
      })}
      <OrderItemContainer>
        <BotContainer className="alt">
          <FinalPriceContainer>
            <Collapse in={!tabletMode || open} timeout="auto" unmountOnExit>
              <PriceRow>
                <PriceText className="secondary">Tiền hàng:</PriceText>
                <PriceText>
                  {!receipt ? (
                    <Skeleton variant="text" width={90} />
                  ) : (
                    currencyFormat.format(displayInfo?.subTotal)
                  )}
                </PriceText>
              </PriceRow>
              <PriceRow>
                <PriceText className="secondary">Phí vận chuyển:</PriceText>
                <PriceText>
                  {!receipt ? (
                    <Skeleton variant="text" width={85} />
                  ) : (
                    currencyFormat.format(displayInfo?.shipping)
                  )}
                </PriceText>
              </PriceRow>
              {displayInfo?.shippingDiscount > 0 && (
                <PriceRow>
                  <PriceText className="secondary">
                    Giảm phí vận chuyển:
                  </PriceText>
                  <PriceText className="discount">
                    {currencyFormat.format(-displayInfo?.shippingDiscount)}
                  </PriceText>
                </PriceRow>
              )}
              {displayInfo?.couponDiscount > 0 && (
                <PriceRow>
                  <PriceText className="secondary">
                    Giảm từ mã giảm giá:
                  </PriceText>
                  <PriceText className="discount">
                    {currencyFormat.format(-displayInfo?.couponDiscount)}
                  </PriceText>
                </PriceRow>
              )}
              <Divider sx={{ my: 1 }} />
            </Collapse>
            <PriceRow onClick={togglePrice}>
              <PriceText>Tổng:</PriceText>
              <FinalPrice color="primary">
                {!receipt ? (
                  <Skeleton variant="text" width={90} />
                ) : (
                  currencyFormat.format(receipt?.total - receipt?.totalDiscount)
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
                  {!receipt ? (
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

export default OrderReceiptDetails;
