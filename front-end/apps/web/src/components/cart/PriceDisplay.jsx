import { Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import {
  CheckoutRow,
  CheckoutText,
  DetailContainer,
} from "../custom/CartComponents";
import { currencyFormat } from "@ring/shared";

const PriceDisplay = ({ displayInfo, loggedIn }) => {
  return (
    <DetailContainer>
      <CheckoutRow>
        <CheckoutText>Tiền hàng:</CheckoutText>
        <CheckoutText>
          {currencyFormat.format(displayInfo.subTotal)}
        </CheckoutText>
      </CheckoutRow>
      <CheckoutRow>
        <CheckoutText>Phí vận chuyển:</CheckoutText>
        <CheckoutText>
          {currencyFormat.format(displayInfo.shipping)}
        </CheckoutText>
      </CheckoutRow>
      <TransitionGroup>
        {displayInfo.shippingDiscount > 0 && (
          <Collapse key={"shipping-discount"}>
            <CheckoutRow>
              <CheckoutText>Khuyến mãi vận chuyển:</CheckoutText>
              <CheckoutText>
                -{currencyFormat.format(displayInfo.shippingDiscount)}
              </CheckoutText>
            </CheckoutRow>
          </Collapse>
        )}
        {displayInfo.deal > 0 && (
          <Collapse key={"product-discount"}>
            <CheckoutRow>
              <CheckoutText>Giảm giá sản phẩm:</CheckoutText>
              <CheckoutText>
                -{currencyFormat.format(displayInfo.deal)}
              </CheckoutText>
            </CheckoutRow>
          </Collapse>
        )}
        {displayInfo.couponDiscount > 0 && (
          <Collapse key={"coupon-discount"}>
            <CheckoutRow>
              <CheckoutText>Giảm giá từ coupon:</CheckoutText>
              <CheckoutText>
                -{currencyFormat.format(displayInfo.couponDiscount)}
              </CheckoutText>
            </CheckoutRow>
          </Collapse>
        )}
        {!loggedIn && displayInfo.subTotal > 0 && (
          <Collapse key={"disclaimer"}>
            <CheckoutRow>
              <CheckoutText></CheckoutText>
              <CheckoutText color="warning">
                &nbsp;
                <br />
                Đăng nhập để có thể áp dụng mã
              </CheckoutText>
            </CheckoutRow>
          </Collapse>
        )}
      </TransitionGroup>
    </DetailContainer>
  );
};

export default PriceDisplay;
