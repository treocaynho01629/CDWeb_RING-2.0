import styled from "@emotion/styled";
import { RemoveShoppingCart as RemoveShoppingCartIcon } from "@mui/icons-material";
import { Button, Skeleton, Popover, Paper } from "@mui/material";
import { Link } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { currencyFormat } from "@ring/shared";

//#region styled
const MiniCartContainer = styled.div`
  width: 400px;
  padding: 10px 20px;
`;

const CartTitleContainer = styled.div`
  margin: 15px 0;
`;

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: cneter;
  height: 250px;
`;

const ProductTitle = styled.span`
  width: 100%;
  font-size: 14px;
  font-weight: 450;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @supports (-webkit-line-clamp: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const ProductPrice = styled.span`
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  margin-left: 10px;
`;

const ActionContainer = styled.div`
  margin: 10px 0;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
//#endregion

const MiniCart = ({ openCart, anchorElCart, handleClose, products }) => {
  return (
    <Popover
      id="mouse-over-popover-cart"
      open={openCart}
      anchorEl={anchorElCart}
      onClose={handleClose}
      onClick={handleClose}
      disableRestoreFocus
      disableScrollLock
      transitionDuration={200}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      sx={{ pointerEvents: "none" }}
      slotProps={{
        paper: {
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            bgcolor: "background.paper",
            mt: 1.5,
            borderRadius: 0,
            pointerEvents: "auto",
          },
          onMouseLeave: handleClose,
        },
      }}
    >
      <Paper
        elevation={7}
        sx={{
          display: "block",
          position: "absolute",
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: "background.paper",
          transform: "translateY(-50%) rotate(45deg)",
          boxShadow: "none",
          zIndex: 0,
        }}
      />
      <MiniCartContainer>
        <CartTitleContainer>
          <b>Sản phẩm trong giỏ hàng</b>
        </CartTitleContainer>
        {products?.length == 0 ? (
          <EmptyCartContainer>
            <RemoveShoppingCartIcon sx={{ fontSize: "50px" }} />
            <b>GIỎ HÀNG TRỐNG</b>
          </EmptyCartContainer>
        ) : (
          <>
            {products?.slice(0, 5).map((product, index) => (
              <ItemContainer key={`cartitem-${index}-${product?.id}`}>
                <LazyLoadImage
                  width={50}
                  height={50}
                  style={{ objectFit: "contain" }}
                  src={`${product?.image}?size=tiny`}
                  alt={`Cart item: ${product?.title}`}
                  placeholder={
                    <Skeleton
                      width={50}
                      height={50}
                      animation={false}
                      variant="rectangular"
                    />
                  }
                />
                <ItemInfo>
                  <ProductTitle>{product?.title}</ProductTitle>
                  <ProductPrice>
                    {currencyFormat.format(product?.price)}
                  </ProductPrice>
                </ItemInfo>
              </ItemContainer>
            ))}
            <ActionContainer>
              <span>
                {products?.length <= 5 ? (
                  <>&nbsp;</>
                ) : (
                  `Còn lại ${products?.length - 5} trong giỏ`
                )}
              </span>
              <Link to={"/cart"}>
                <Button variant="contained" color="primary" size="medium">
                  Xem giỏ hàng
                </Button>
              </Link>
            </ActionContainer>
          </>
        )}
      </MiniCartContainer>
    </Popover>
  );
};

export default MiniCart;
