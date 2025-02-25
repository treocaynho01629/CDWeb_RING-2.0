import { Suspense, lazy, useLayoutEffect } from "react";
import { NavLink } from "react-router";
import { ChevronLeft } from "@mui/icons-material";
import { ReactComponent as EmptyIcon } from "@ring/shared/assets/empty";
import { Button } from "@mui/material";
import { useTitle, useConfirm } from "@ring/shared";
import Placeholder from "@ring/ui/Placeholder";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";
import styled from "@emotion/styled";
import useCart from "../hooks/useCart";

const CartContent = lazy(() => import("../components/cart/CartContent"));

//#region styled
const EmptyWrapper = styled.div`
  height: 80dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  position: relative;
  min-height: 90dvh;
`;

const StyledEmptyIcon = styled(EmptyIcon)`
  height: 250px;
  width: 250px;
  fill: ${({ theme }) => theme.palette.text.icon};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 200px;
    height: 200px;
  }
`;
//#endregion

const Cart = () => {
  const { cartProducts } = useCart();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Xoá khỏi giỏ?",
    "Xoá sản phẩm đã chọn khỏi giỏ?"
  );
  useTitle("Giỏ hàng"); //Set title

  useLayoutEffect(() => {
    if (cartProducts.length == 0)
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cartProducts]);

  return (
    <Wrapper>
      <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
        <NavLink to={"/cart"}>Giỏ hàng</NavLink>
      </CustomBreadcrumbs>
      {!cartProducts.length ? (
        <EmptyWrapper>
          <StyledEmptyIcon />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <NavLink to={"/"}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ChevronLeft />}
            >
              Tiếp tục mua sắm
            </Button>
          </NavLink>
        </EmptyWrapper>
      ) : (
        <Suspense
          fallback={
            <EmptyWrapper>
              <Placeholder />
            </EmptyWrapper>
          }
        >
          <CartContent confirm={confirm} />
          <ConfirmationDialog />
        </Suspense>
      )}
    </Wrapper>
  );
};

export default Cart;
