import styled from '@emotion/styled'
import { AddShoppingCart } from '@mui/icons-material';
import { Button, Box, Divider, useTheme, useMediaQuery, Skeleton, SwipeableDrawer } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { currencyFormat } from "@ring/shared";
import useCart from '../../../hooks/useCart';
import AmountInput from '../../custom/AmountInput';

//#region styled
const AmountCount = styled.span`
    font-size: 14px;
    margin-left: 20px;
    color: ${props => props.theme.palette.text.secondary};
    white-space: nowrap;

    &.error {
        color: ${props => props.theme.palette.error.main};
        text-decoration: underline;
        font-weight: bold;
    }
`

const FilterContainer = styled.div`
    position: relative;
    margin: 0px 0px 30px 0px;
    width: 100%;
    display: block;
    
    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const AltFilterContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: ${props => props.theme.zIndex.appBar};
    box-shadow: ${props => props.theme.shadows[12]};
    background-color: ${props => props.theme.palette.background.paper};
    align-items: flex-end;
    display: none;

    ${props => props.theme.breakpoints.down("md")} {
        display: flex;
    }
`

const DetailTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
`

const BuyButton = styled(Button)`
    margin-top: 15px;
    height: 100%;
    line-height: 1.5;
`

const StyledImage = styled.img`
    object-fit: contain;
    width: 115px;
    height: 115px;
    border: .5px solid ${props => props.theme.palette.action.focus};
`

const ProductDetailContainer = styled.div`
    padding: 20px 10px 0px 10px;
    display: flex;
    align-items: flex-end;
    position: relative;
`

const Price = styled.span`
    color: ${props => props.theme.palette.primary.main};
    margin: 10px 20px;
    margin-right: 0;
`

const Discount = styled(Price)`
    color: ${props => props.theme.palette.text.secondary};
    text-decoration: line-through;
    margin-left: 10px;
`
//#endregion

const ProductAction = ({ book }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const tabletMode = useMediaQuery(theme.breakpoints.down('md'));
    const [amountIndex, setAmountIndex] = useState(1); //Amount add to cart
    const [open, setOpen] = useState(false);
    const [openNow, setOpenNow] = useState(false);
    const { addProduct } = useCart();

    //Change add amount
    const changeAmount = (n) => {
        setAmountIndex(prev => (prev + n < 1 ? 1 : prev + n > (book?.amount ?? 199) ? (book?.amount ?? 199) : prev + n));
    }

    const handleChangeAmount = (value) => {
        let newValue = value;
        if (newValue < 1 || !Number.isInteger(newValue)) newValue = 1;
        if (newValue > (book?.amount ?? 199)) newValue = (book?.amount ?? 199);
        setAmountIndex(newValue);
    }

    const handleOpen = () => {
        setOpen(true);
        setOpenNow(false);
    };

    const handleOpenNow = () => {
        setOpen(false);
        setOpenNow(true);
    }

    const handleClose = () => {
        setOpen(false);
        setOpenNow(false);
    }

    //Add to cart
    const handleAddToCart = (book) => {
        handleClose();
        addProduct(book, amountIndex);
    };

    const handleBuyNow = (book) => {
        handleAddToCart(book);
        navigate('/cart');
    }

    return (
        tabletMode ?
            <>
                <AltFilterContainer >
                    <BuyButton
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ maxWidth: '35%' }}
                        disabled={!book || book?.amount == 0}
                        onClick={handleOpen}
                    >
                        <AddShoppingCart />
                    </BuyButton>
                    <BuyButton
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!book || book?.amount == 0}
                        onClick={handleOpenNow}
                    >
                        {!book ? 'Đang tải' : book?.amount == 0 ? 'Hết hàng'
                            : `Mua ngay (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
                    </BuyButton>
                </AltFilterContainer>
                <SwipeableDrawer
                    anchor="bottom"
                    open={(open || openNow)}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    disableBackdropTransition
                    disableSwipeToOpen={true}
                >
                    <ProductDetailContainer>
                        <StyledImage
                            src={book?.image}
                            alt={`${book?.title} preview image`}
                            sizes='250px'
                        />
                        <Box>
                            <Box display="flex">
                                <Price>{currencyFormat.format(book?.price * (1 - book?.discount))}</Price>
                                {book?.discount > 0 && <Discount>{currencyFormat.format(book?.price)}</Discount>}
                            </Box>
                            <AmountCount className={book?.amount > 0 ? '' : 'error'}>
                                {book?.amount > 0 ? `(${book?.amount}) sản phẩm còn lại` : 'Tạm thời hết hàng'}
                            </AmountCount>
                        </Box>
                    </ProductDetailContainer>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" alignItems="center" justifyContent={'space-between'} padding={'0 10px'}>
                        <DetailTitle>Số lượng:</DetailTitle>
                        <AmountInput
                            disabled={!book || book?.amount == 0}
                            size="small"
                            max={book?.amount}
                            value={amountIndex}
                            error={1 > amountIndex > (book?.amount ?? 199)}
                            onChange={(e) => handleChangeAmount(e.target.valueAsNumber)}
                            handleDecrease={() => changeAmount(-1)}
                            handleIncrease={() => changeAmount(1)}
                        />
                    </Box>
                    {openNow ?
                        <BuyButton
                            variant="outlined"
                            color="warning"
                            size="large"
                            sx={{ margin: '5px' }}
                            onClick={() => handleBuyNow(book)}
                        >
                            {!book ? 'Đang tải' : book?.amount == 0 ? 'Hết hàng'
                                : `Mua ngay (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
                        </BuyButton>
                        :
                        <BuyButton
                            variant="outlined"
                            color="primary"
                            size="large"
                            sx={{ margin: '5px' }}
                            onClick={() => handleAddToCart(book)}
                        >
                            {!book ? 'Đang tải' : book?.amount == 0 ? 'Hết hàng'
                                : `Thêm vào giỏ (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
                        </BuyButton>
                    }
                </SwipeableDrawer>
            </>
            : <FilterContainer>
                <Box display="flex" alignItems="center" flexWrap="wrap">
                    <DetailTitle style={{ marginRight: 20 }}>Số lượng:</DetailTitle>
                    <Box display="flex" alignItems="center" my={1}>
                        <AmountInput
                            disabled={!book || book?.amount == 0}
                            size="small"
                            max={book?.amount}
                            value={amountIndex}
                            error={1 > amountIndex > (book?.amount ?? 199)}
                            onChange={(e) => handleChangeAmount(e.target.valueAsNumber)}
                            handleDecrease={() => changeAmount(-1)}
                            handleIncrease={() => changeAmount(1)}
                        />
                        {book ?
                            <AmountCount className={book?.amount > 0 ? '' : 'error'}>
                                {book?.amount > 0 ? `(${book?.amount}) sản phẩm còn lại` : 'Tạm thời hết hàng'}
                            </AmountCount>
                            : <Skeleton variant="text" sx={{ fontSize: '14px', marginLeft: 2 }} width={200} />
                        }
                    </Box>
                </Box>
                <Box position="sticky" height={55} bottom={16} bgcolor={'background.paper'}>
                    <Box display="flex" alignItems="center" height={47} >
                        <BuyButton
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ maxWidth: '40%', marginRight: 1 }}
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
                            {!book ? 'Đang tải' : book?.amount == 0 ? 'Hết hàng'
                                : `Thêm vào giỏ (${currencyFormat.format(book?.price * (1 - book?.discount) * amountIndex)})`}
                        </BuyButton>
                    </Box>
                </Box>
            </FilterContainer>
    )
}

export default ProductAction