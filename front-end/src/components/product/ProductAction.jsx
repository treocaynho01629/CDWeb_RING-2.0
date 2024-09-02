import styled from 'styled-components'
import { AddShoppingCart } from '@mui/icons-material';
import { Button, Box, Divider, Drawer, useTheme, useMediaQuery, Skeleton } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAmountInput from '../custom/CustomAmountInput';
import useCart from '../../hooks/useCart';

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
    margin: 30px 0px;
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
    z-index: 99;
    box-shadow: ${props => props.theme.shadows[12]};
    background-color: ${props => props.theme.palette.primary.main};
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
    padding: 10px;
    margin-top: 15px;
    white-space: nowrap;

    ${props => props.theme.breakpoints.down("md_lg")} {
        .total { display: none };
    }
`

const StyledImage = styled.img`
    object-fit: contain;
    width: 125px;
    height: 125px;
    border: .5px solid ${props => props.theme.palette.action.focus};
`

const ProductDetailContainer = styled.div`
    padding: 20px 10px 0px 10px;
    display: flex;
    align-items: flex-end;
    position: relative;
`

const Price = styled.p`
    color: ${props => props.theme.palette.primary.main};
    margin-left: 20px;

    &.old {
        color: ${props => props.theme.palette.text.secondary};
        text-decoration: line-through;
    }
`

const OldPrice = styled(Price)`
    color: ${props => props.theme.palette.text.secondary};
    text-decoration: line-through;
    margin-left: 10px;
`
//#endregion

const ProductAction = ({ book }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const [amountIndex, setAmountIndex] = useState(1); //Amount add to cart
    const [open, setOpen] = useState(false);
    const [openNow, setOpenNow] = useState(false);
    const { addProduct } = useCart();

    //Change add amount
    const changeAmount = (n) => {
        setAmountIndex(prev => (prev + n < 1 ? 1 : prev + n));
    }

    const handleChangeAmount = (value) => {
        let newValue = value;
        if (newValue < 1 || !Number.isInteger(newValue)) newValue = 1;
        setAmountIndex(newValue);
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        setOpenNow(!newOpen);
    };

    //Add to cart
    const handleAddToCart = (book) => {
        setOpen(false); //Close drawer
        addProduct({
            id: book?.id,
            title: book?.title,
            price: book?.price,
            image: book?.image,
            quantity: amountIndex,
        })
    };

    const handleBuyNow = (book) => {
        handleAddToCart(book);
        navigate('/cart');
    }

    return (
        mobileMode ?
            <>
                <AltFilterContainer >
                    <BuyButton
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ maxWidth: '35%', height: '100%' }}
                        disabled={!book || book?.amount == 0}
                        onClick={toggleDrawer(true)}
                    >
                        <AddShoppingCart />
                    </BuyButton>
                    <BuyButton
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!book || book?.amount == 0}
                        onClick={() => handleBuyNow(book)}
                    >
                        Mua ngay
                    </BuyButton>
                </AltFilterContainer >
                <Drawer
                    anchor={'bottom'}
                    open={open}
                    onClose={toggleDrawer(false)}
                >
                    <ProductDetailContainer>
                        <StyledImage
                            src={book?.image}
                            alt={'Product image'}
                            sizes='300px'
                        />
                        <Box>
                            <Box display="flex">
                                <Price>{book?.price?.toLocaleString()}đ</Price>
                                <OldPrice>{Math.round(book?.price * 1.1).toLocaleString()}đ</OldPrice>
                            </Box>
                            <AmountCount className={book?.amount > 0 ? '' : 'error'}>
                                {book?.amount > 0 ? `(${book?.amount}) sản phẩm còn lại` : 'Tạm thời hết hàng'}
                            </AmountCount>
                        </Box>
                    </ProductDetailContainer>
                    <Divider sx={{ my: 2 }} />
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'0 10px'}>
                        <DetailTitle>Số lượng:</DetailTitle>
                        <CustomAmountInput
                            size="small"
                            value={amountIndex}
                            onChange={(e) => handleChangeAmount(e.target.valueAsNumber)}
                            handleDecrease={() => changeAmount(-1)}
                            handleIncrease={() => changeAmount(1)}
                        />
                    </Box>
                    <BuyButton
                        variant="outlined"
                        color="primary"
                        size="large"
                        sx={{ margin: '5px' }}
                        onClick={() => handleAddToCart(book)}
                    >
                        Thêm vào giỏ ({(book?.price * amountIndex).toLocaleString()}đ)
                    </BuyButton>
                </Drawer>
            </>
            :
            <FilterContainer>
                <Divider sx={{ my: 2, display: { xs: 'none', md: 'block' } }} />
                <Box display="flex" alignItems="center" flexWrap="wrap">
                    <DetailTitle style={{ marginRight: 20 }}>Số lượng:</DetailTitle>
                    <Box display="flex" alignItems="center" my={1}>
                        <CustomAmountInput
                            disabled={!book || book?.amount == 0}
                            size="small"
                            value={amountIndex}
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
                <Box display="flex" alignItems="center">
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
                        Thêm vào giỏ&nbsp;<span className="total">({(book?.price * amountIndex).toLocaleString()}đ)</span>
                    </BuyButton>
                </Box>
            </FilterContainer>
    )
}

export default ProductAction