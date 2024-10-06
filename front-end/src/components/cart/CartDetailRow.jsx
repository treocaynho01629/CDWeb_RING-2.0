
import styled from 'styled-components'
import { Fragment } from 'react';
import { MoreHoriz, Storefront, KeyboardArrowRight } from '@mui/icons-material';
import { IconButton, TableRow, Box, Skeleton } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import CustomAmountInput from '../custom/CustomAmountInput';

//#region styled
const StyledTableRow = styled(TableRow)`
    position: relative;

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};
        z-index: -1;

        &.shop {
            border-bottom: none;
        }

        ${props => props.theme.breakpoints.down("sm")} {
            border-left: none;
            border-right: none;
        }
    }
`

const StyledItemTableRow = styled(TableRow)`
    position: relative;

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};
        border-top: none;
        border-bottom: none;
        z-index: -1;

        ${props => props.theme.breakpoints.down("sm")} {
            border: none;
        }
    }
`

const SpaceTableRow = styled(TableRow)`
    height: 16px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 8px;
    }
`

const ItemContainer = styled.div`
    display: flex;
    width: 100%;
`

const ItemSummary = styled.div`
    margin-left: 10px;
    width: 100%;
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

    &:hover {
        color: ${props => props.theme.palette.info.main};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        max-width: 95%;
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

const ShopTitle = styled.b`
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
    font-weight: bold;
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

const hoverIcon = {
    position: 'absolute',
    right: 1,
    top: 2,
};
//#endregion

const CartDetailRow = ({ id, index, shop, coupon, isSelected, isShopSelected, handleSelect, handleSelectShop,
    handleDecrease, handleChangeQuantity, handleChangeCoupon, handleClick, 
    StyledCheckbox, StyledTableCell, ActionTableCell }) => {
    const isGroupSelected = isShopSelected(shop);
    const shopLabelId = `shop-label-checkbox-${index}`;

    return (
        <Fragment key={`space-${id}-${index}`}>
            <SpaceTableRow />
            <StyledTableRow
                role="shop-checkbox"
                className="shop"
                tabIndex={-1}
            >
                <StyledTableCell sx={{ paddingTop: '4px' }} padding="checkbox">
                    <StyledCheckbox
                        color="primary"
                        onChange={() => handleSelectShop(shop)}
                        checked={isGroupSelected}
                        inputProps={{ 'aria-labelledby': shopLabelId }}
                    />
                </StyledTableCell>
                <StyledTableCell align="left" colSpan={5}>
                    <Link to={`/filters`}>
                        <ShopTitle>
                            <ShopTag>Đối tác</ShopTag>
                            <Storefront />&nbsp;{shop.shopName}<KeyboardArrowRight fontSize="small" />
                        </ShopTitle>
                    </Link>
                </StyledTableCell>
            </StyledTableRow>
            {shop.products?.map((product, index) => {
                const isItemSelected = isSelected(product.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                    <StyledItemTableRow
                        role="checkbox"
                        tabIndex={-1}
                        key={product.id}
                    >
                        <StyledTableCell padding="checkbox">
                            <StyledCheckbox
                                disableRipple
                                disableFocusRipple
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                onClick={() => handleSelect(product.id)}
                            />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="product">
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
                                        <ItemTitle>{product.title}</ItemTitle>
                                    </Link>
                                    <ItemAction>
                                        <Box display={{ xs: 'block', md: 'none' }}>
                                            {product?.discount > 0 ? <>
                                                <Discount>{product.price.toLocaleString()}đ</Discount>
                                                <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                                            </>
                                                : <>
                                                    <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                                                    <Discount><br /></Discount>
                                                </>
                                            }

                                        </Box>
                                        <Box display={{ xs: 'flex', sm: 'none' }}>
                                            <CustomAmountInput
                                                size="small"
                                                value={product.quantity}
                                                onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                                                handleDecrease={() => handleDecrease(product.quantity, product.id)}
                                                handleIncrease={() => increaseAmount(product.id)}
                                            />
                                        </Box>
                                    </ItemAction>
                                </ItemSummary>
                            </ItemContainer>
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                            {product?.discount > 0 && <Discount>{product.price.toLocaleString()}đ</Discount>}
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <CustomAmountInput
                                size="small"
                                value={product.quantity}
                                onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                                handleDecrease={() => handleDecrease(product.quantity, product.id)}
                                handleIncrease={() => increaseAmount(product.id)}
                            />
                            <AmountLeft>Còn {product.amount} sản phẩm</AmountLeft>
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Price className="total">{(Math.round(product.price * (1 - (product?.discount || 0))) * product.quantity).toLocaleString()}đ</Price>
                        </StyledTableCell>
                        <ActionTableCell>
                            <IconButton sx={hoverIcon} onClick={(e) => handleClick(e, product)}>
                                <MoreHoriz />
                            </IconButton>
                        </ActionTableCell>
                    </StyledItemTableRow>
                )
            })}
            <StyledTableRow role="coupon-row" tabIndex={-1}>
                <StyledTableCell align="left" colSpan={6}>
                    <ShopTitle onClick={(e) => handleChangeCoupon(e, id)}>TEMP: {coupon[id]}</ShopTitle>
                </StyledTableCell>
            </StyledTableRow>
        </Fragment>
    )
}

export default CartDetailRow