import styled from '@emotion/styled'
import { Fragment, useEffect } from 'react';
import { MoreHoriz, Storefront, KeyboardArrowRight, LocalActivityOutlined } from '@mui/icons-material';
import { IconButton, Box, Skeleton } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router';
import { ActionTableCell, StyledItemTableRow, StyledTableRow, SpaceTableRow, StyledTableCell } from '../custom/CustomTableComponents';
import CustomAmountInput from '../custom/CustomAmountInput';

//#region styled
const ItemContainer = styled.div`
    display: flex;
    width: 100%;
`

const ItemSummary = styled.div`
    margin-left: 10px;
    width: 100%;
    max-height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const ItemTitle = styled.p`
    font-size: 14px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 5px 0px;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &.error {
        color: ${props => props.theme.palette.error.light};
    }

    &:hover {
        color: ${props => props.theme.palette.info.main};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;

        @supports (-webkit-line-clamp: 1) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
`

const Shop = styled.b`
    font-size: 15px;
	white-space: nowrap;
    display: flex;
    align-items: center;
    
    svg { color: ${props => props.theme.palette.text.secondary} }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
        margin: 8px 0;
    }
`

const CouponButton = styled.b`
    font-size: 15px;
	white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    span {
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
        margin: 8px 0;
    }
`

const ShopTag = styled.span`
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
    padding: 2px 10px;
    margin-right: 8px;
`

const ItemAction = styled.div`
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
`

const Price = styled.p`
    font-size: 16px;
    font-weight: 450;
    text-align: left;
    color: ${props => props.theme.palette.primary.main};
    margin: 0;

    &.total {
        color: ${props => props.theme.palette.warning.light};
    }
`

const Discount = styled.p`
    font-size: 12px;
    color: ${props => props.theme.palette.text.disabled};
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    text-decoration: line-through;
`

const AmountLeft = styled.span`
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.palette.error.light};
`

const StyledLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    height: 90px;
    width: 90px;
    border: .5px solid ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        height: 80px;
        width: 80px;
    }
`

const StyledSkeleton = styled(Skeleton)`
    display: inline-block;
    height: 90px;
    width: 90px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 80px;
        width: 80px;
    }
`

const StyledIconButton = styled(IconButton)`
    position: absolute;
    right: 4px;
    top: 4px;

    ${props => props.theme.breakpoints.down("sm")} {
        right: 0;
        bottom: 0;
        top: auto;
    }
`
//#endregion

function ItemRow({ product, index, handleSelect, handleDeselect, isSelected, handleDecrease, increaseAmount,
    handleChangeQuantity, handleClick, StyledCheckbox }) {
    const isItemSelected = isSelected(product.id);
    const labelId = `item-checkbox-${index}`;
    const isDisabled = !product || product.amount < 1;

    useEffect(() => {
        if (product.amount < 1 || product.quantity > product.amount) handleDeselect(product.id);
    }, [product.amount])

    return (
        <StyledItemTableRow
            role="checkbox"
            tabIndex={-1}
            key={`item-${product.id}-${index}`}
            className={isDisabled ? 'error' : ''}
        >
            <StyledTableCell padding="checkbox">
                <StyledCheckbox
                    disabled={isDisabled}
                    disableRipple
                    disableFocusRipple
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                    onClick={() => handleSelect(product.id)}
                />
            </StyledTableCell>
            <StyledTableCell component="th" id={labelId} scope="row">
                <ItemContainer>
                    <Link to={`/product/${product.slug}`}>
                        <StyledLazyImage
                            src={`${product.image}?size=small`}
                            alt={`${product.title} Cart item`}
                            placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                        />
                    </Link>
                    <ItemSummary>
                        <Link to={`/product/${product.slug}`}>
                            <ItemTitle className={isDisabled ? 'error' : ''}>{product.title}</ItemTitle>
                        </Link>
                        <ItemAction>
                            <Box display={{ xs: 'block', md: 'none', md_lg: 'block', lg: 'none' }}>
                                <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                                <Discount>{product?.discount > 0 ? `${product.price.toLocaleString()}đ` : ''}</Discount>
                            </Box>
                            <Box display={{ xs: 'flex', sm: 'none' }} mr={3}>
                                <CustomAmountInput
                                    disabled={isDisabled}
                                    size="small"
                                    max={product.amount}
                                    value={product.quantity}
                                    error={1 > product.quantity > (product.amount ?? 199)}
                                    onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                                    handleDecrease={() => handleDecrease(product.quantity, product.id)}
                                    handleIncrease={() => increaseAmount(product.id)}
                                />
                            </Box>
                        </ItemAction>
                    </ItemSummary>
                </ItemContainer>
            </StyledTableCell>
            <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell', md_lg: 'none', lg: 'table-cell' } }}>
                <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                {product?.discount > 0 && <Discount>{product.price.toLocaleString()}đ</Discount>}
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <CustomAmountInput
                    disabled={isDisabled}
                    size="small"
                    max={product.amount}
                    value={product.quantity}
                    error={1 > product.quantity > (product.amount ?? 199)}
                    onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                    handleDecrease={() => handleDecrease(product.quantity, product.id)}
                    handleIncrease={() => increaseAmount(product.id)}
                />
                <AmountLeft>
                    {product.amount > 0 ? `Còn ${product.amount} sản phẩm`
                        : 'Hết hàng'}
                </AmountLeft>
            </StyledTableCell>
            <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Price className="total">{(Math.round(product.price * (1 - (product?.discount || 0))) * product.quantity).toLocaleString()}đ</Price>
            </StyledTableCell>
            <ActionTableCell>
                <StyledIconButton onClick={(e) => handleClick(e, product)}>
                    <MoreHoriz />
                </StyledIconButton>
            </ActionTableCell>
        </StyledItemTableRow>
    )
}

const CartDetailRow = ({ id, index, shop, coupon, couponDiscount, isSelected, isShopSelected, handleSelect, handleDeselect,
    handleSelectShop, handleDecrease, handleChangeQuantity, handleClick, increaseAmount,
    handleOpenDialog, StyledCheckbox }) => {
    const isGroupSelected = isShopSelected(shop);
    const shopLabelId = `shop-label-checkbox-${index}`;

    return (
        <Fragment key={`detail-${id}-${index}`}>
            <SpaceTableRow />
            <StyledTableRow role="shop-checkbox" tabIndex={-1}>
                <StyledTableCell padding="checkbox">
                    <StyledCheckbox
                        color="primary"
                        onChange={() => handleSelectShop(shop)}
                        checked={isGroupSelected}
                        inputProps={{ 'aria-labelledby': shopLabelId }}
                    />
                </StyledTableCell>
                <StyledTableCell align="left" colSpan={5} component="th" id={shopLabelId} scope="row">
                    <Link to={'/store'}>
                        <Shop>
                            <ShopTag>Đối tác</ShopTag>
                            <Storefront />&nbsp;{shop.shopName}<KeyboardArrowRight fontSize="small" />
                        </Shop>
                    </Link>
                </StyledTableCell>
            </StyledTableRow>
            {shop.products?.map((product, index) => (
                <ItemRow key={`item-${product.id}-${index}`}
                    {...{
                        product, index, handleSelect, handleDeselect, isSelected, handleDecrease, handleChangeQuantity,
                        handleClick, increaseAmount, StyledCheckbox
                    }} />
            ))}
            <StyledTableRow role="coupon-row">
                <StyledTableCell align="left" colSpan={6}>
                    <CouponButton onClick={() => handleOpenDialog(id)}>
                        <span>
                            <LocalActivityOutlined color="error" />&nbsp;
                            {coupon
                                ? couponDiscount
                                    ? isGroupSelected
                                        ? `Đã giảm ${couponDiscount.toLocaleString()}đ`
                                        : `Mua thêm để giảm ${coupon?.detail.discount * 100}% - giảm tối đa ${coupon?.detail.maxDiscount.toLocaleString()}đ`
                                    : `Mua thêm để giảm ${coupon?.detail.discount * 100}% - giảm tối đa ${coupon?.detail.maxDiscount.toLocaleString()}đ`
                                : 'Thêm mã giảm giá'
                            }
                        </span>
                        <KeyboardArrowRight fontSize="small" />
                    </CouponButton>
                </StyledTableCell>
            </StyledTableRow>
        </Fragment>
    )
}

export default CartDetailRow