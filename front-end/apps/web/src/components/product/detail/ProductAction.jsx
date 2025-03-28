import styled from "@emotion/styled";
import { AddShoppingCart } from "@mui/icons-material";
import {
  Button,
  Box,
  Divider,
  useMediaQuery,
  Skeleton,
  SwipeableDrawer,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { currencyFormat } from "@ring/shared";
import useCart from "../../../hooks/useCart";
import AmountInput from "../../custom/AmountInput";
import useOffset from "../../../hooks/useOffset";

//#region styled
const AmountCount = styled.span`
  font-size: 14px;
  margin-left: 20px;
  color: ${({ theme }) => theme.palette.text.secondary};
  white-space: nowrap;

  &.error {
    color: ${({ theme }) => theme.palette.error.main};
    text-decoration: underline;
    font-weight: bold;
  }
`;

const FilterContainer = styled.div`
  position: relative;
  margin: 0px 0px 30px 0px;
  width: 100%;
  display: block;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const AltFilterContainer = styled.div`
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

const DetailTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
`;

const BuyButton = styled(Button)`
  margin-top: 15px;
  height: 100%;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 0;
  }
`;

const StyledImage = styled.img`
  object-fit: contain;
  width: 115px;
  height: 115px;
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
`;

const ProductDetailContainer = styled.div`
  padding: 20px 10px 0px 10px;
  display: flex;
  align-items: flex-end;
  position: relative;
`;

const Price = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 10px 20px;
  margin-right: 0;
`;

const Discount = styled(Price)`
  color: ${({ theme }) => theme.palette.text.secondary};
  text-decoration: line-through;
  margin-left: 10px;
`;
//#endregion

const MIN_VALUE = 1;
const MAX_VALUE = 199;

const ProductAction = ({ book }) => {
  const overlapRef = useRef(null);
  const navigate = useNavigate();
  const tabletMode = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [amountIndex, setAmountIndex] = useState(1); //Amount add to cart
  const [open, setOpen] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const { addProduct } = useCart();

  //Change add amount
  const changeAmount = (n) => {
    setAmountIndex((prev) =>
      prev + n < MIN_VALUE
        ? MIN_VALUE
        : prev + n > (book?.amount ?? MAX_VALUE)
          ? (book?.amount ?? MAX_VALUE)
          : prev + n
    );
  };

  const handleChangeAmount = (value) => {
    let newValue = value;
    if (newValue < MIN_VALUE || !Number.isInteger(newValue))
      newValue = MIN_VALUE;
    if (newValue > (book?.amount ?? MAX_VALUE))
      newValue = book?.amount ?? MAX_VALUE;
    setAmountIndex(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
    setOpenNow(false);
  };

  const handleOpenNow = () => {
    setOpen(false);
    setOpenNow(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenNow(false);
  };

  //Add to cart
  const handleAddToCart = (book) => {
    handleClose();
    addProduct(book, amountIndex);
  };

  const handleBuyNow = (book) => {
    handleAddToCart(book);
    navigate("/cart");
  };

  //Prevent overlap
  useOffset(overlapRef);

  return (
    <>
      {tabletMode ? (
        <>
          <AltFilterContainer ref={overlapRef}>
            <BuyButton
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              sx={{ maxWidth: { xs: "35%", sm: "45%" }, mr: { xs: 0, sm: 1 } }}
              disabled={!book || book?.amount == 0}
              onClick={handleOpen}
              startIcon={<AddShoppingCart />}
            >
              <Box display={{ xs: "none", sm: "block" }}>Thêm vào giỏ</Box>
            </BuyButton>
            <BuyButton
              variant="contained"
              size="large"
              fullWidth
              disabled={!book || book?.amount == 0}
              onClick={handleOpenNow}
            >
              {!book
                ? "Đang tải"
                : book?.amount == 0
                  ? "Hết hàng"
                  : `Mua ngay (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
            </BuyButton>
          </AltFilterContainer>
          <SwipeableDrawer
            anchor="bottom"
            open={open || openNow}
            onOpen={handleOpen}
            onClose={handleClose}
            disableBackdropTransition
            disableSwipeToOpen={true}
          >
            <ProductDetailContainer>
              <StyledImage
                src={book?.image}
                alt={`${book?.title} preview image`}
                sizes="250px"
              />
              <Box>
                <Box display="flex">
                  <Price>
                    {currencyFormat.format(book?.price * (1 - book?.discount))}
                  </Price>
                  {book?.discount > 0 && (
                    <Discount>{currencyFormat.format(book?.price)}</Discount>
                  )}
                </Box>
                <AmountCount className={book?.amount > 0 ? "" : "error"}>
                  {book?.amount > 0
                    ? `(${book?.amount}) sản phẩm còn lại`
                    : "Tạm thời hết hàng"}
                </AmountCount>
              </Box>
            </ProductDetailContainer>
            <Divider sx={{ my: 2 }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
              padding={"0 10px"}
            >
              <DetailTitle>Số lượng:</DetailTitle>
              <AmountInput
                disabled={!book || book?.amount == 0}
                size="small"
                min={MIN_VALUE}
                max={book?.amount ?? MAX_VALUE}
                value={amountIndex}
                error={1 > amountIndex > (book?.amount ?? MAX_VALUE)}
                onChange={(e) => handleChangeAmount(e.target.valueAsNumber)}
                handleDecrease={() => changeAmount(-1)}
                handleIncrease={() => changeAmount(1)}
              />
            </Box>
            {openNow ? (
              <BuyButton
                variant="outlined"
                color="warning"
                size="large"
                sx={{ margin: "5px" }}
                onClick={() => handleBuyNow(book)}
              >
                {!book
                  ? "Đang tải"
                  : book?.amount == 0
                    ? "Hết hàng"
                    : `Mua ngay (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
              </BuyButton>
            ) : (
              <BuyButton
                variant="outlined"
                color="primary"
                size="large"
                sx={{ margin: "5px" }}
                onClick={() => handleAddToCart(book)}
              >
                {!book
                  ? "Đang tải"
                  : book?.amount == 0
                    ? "Hết hàng"
                    : `Thêm vào giỏ (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
              </BuyButton>
            )}
          </SwipeableDrawer>
        </>
      ) : (
        <FilterContainer>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <DetailTitle style={{ marginRight: 20 }}>Số lượng:</DetailTitle>
            <Box display="flex" alignItems="center" my={1}>
              <AmountInput
                disabled={!book || book?.amount == 0}
                size="small"
                min={MIN_VALUE}
                max={book?.amount ?? MAX_VALUE}
                value={amountIndex}
                error={1 > amountIndex > (book?.amount ?? MAX_VALUE)}
                onChange={(e) => handleChangeAmount(e.target.valueAsNumber)}
                handleDecrease={() => changeAmount(-1)}
                handleIncrease={() => changeAmount(1)}
              />
              {book ? (
                <AmountCount className={book?.amount > 0 ? "" : "error"}>
                  {book?.amount > 0
                    ? `(${book?.amount}) sản phẩm còn lại`
                    : "Tạm thời hết hàng"}
                </AmountCount>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "14px", marginLeft: 2 }}
                  width={200}
                />
              )}
            </Box>
          </Box>
          <Box
            position="sticky"
            height={55}
            bottom={16}
            bgcolor={"background.paper"}
          >
            <Box display="flex" alignItems="center" height={47}>
              <BuyButton
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: "40%", marginRight: 1 }}
                disabled={!book || book?.amount == 0}
                onClick={() => handleBuyNow(book)}
              >
                Mua ngay
              </BuyButton>
              <BuyButton
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                disabled={!book || book?.amount == 0}
                onClick={() => handleAddToCart(book)}
                startIcon={<AddShoppingCart fontSize="small" />}
              >
                {!book
                  ? "Đang tải"
                  : book?.amount == 0
                    ? "Hết hàng"
                    : `Thêm vào giỏ (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
              </BuyButton>
            </Box>
          </Box>
        </FilterContainer>
      )}
    </>
  );
};

export default ProductAction;
