import styled from '@emotion/styled'
import { Fragment } from 'react';
import { KeyboardArrowRight, LocalActivityOutlined, Inventory } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyledItemTableRow, StyledTableRow, SpaceTableRow, StyledTableCell } from '../custom/CustomTableComponents';

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
    font-weight: 400;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 0;
	
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

const Shop = styled.span`
    font-size: 15px;
	white-space: nowrap;
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.primary.dark};
    
    svg {
        font-size: 18px; 
    }

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

const ItemAction = styled.div`
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
`

const Price = styled.p`
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: ${props => props.theme.palette.primary.main};
    margin: 0;
    margin-right: ${props => props.theme.spacing(1)};

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

const Amount = styled.span`
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
`

const StyledLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    height: 50px;
    width: 50px;
    border: .5px solid ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        height: 45px;
        width: 45px;
    }
`

const StyledSkeleton = styled(Skeleton)`
    display: inline-block;
    height: 50px;
    width: 50px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 45px;
        width: 45px;
    }
`
//#endregion

function ItemRow({ product, index }) {
    const isDisabled = !product || product.amount < 1;

    return (
        <StyledItemTableRow
            tabIndex={-1}
            key={`item-${product.id}-${index}`}
            className={isDisabled ? 'error' : ''}
        >
            <StyledTableCell className="preview" component="th" scope="row">
                <ItemContainer>
                    <StyledLazyImage
                        src={`${product.image}?size=small`}
                        alt={`${product.title} Cart item`}
                        placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                    />
                    <ItemSummary>
                        <ItemTitle className={isDisabled ? 'error' : ''}>{product.title}</ItemTitle>
                        <ItemAction>
                            <Box display={{ xs: 'flex', md: 'none', md_lg: 'flex', lg: 'none' }}>
                                <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                                <Discount>{product?.discount > 0 ? `${product.price.toLocaleString()}đ` : ''}</Discount>
                            </Box>
                            <Box display={{ xs: 'flex', sm: 'none' }}>
                                x{product.quantity}
                            </Box>
                        </ItemAction>
                    </ItemSummary>
                </ItemContainer>
            </StyledTableCell>
            <StyledTableCell className="preview" align="right" sx={{ display: { xs: 'none', md: 'table-cell', md_lg: 'none', lg: 'table-cell' } }}>
                <Price>{Math.round(product.price * (1 - (product?.discount || 0))).toLocaleString()}đ</Price>
                {product?.discount > 0 && <Discount>{product.price.toLocaleString()}đ</Discount>}
            </StyledTableCell>
            <StyledTableCell className="preview" align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Amount>SL: {product.quantity}</Amount>
            </StyledTableCell>
            <StyledTableCell className="preview" align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Price className="total">{(Math.round(product.price * (1 - (product?.discount || 0))) * product.quantity).toLocaleString()}đ</Price>
            </StyledTableCell>
        </StyledItemTableRow>
    )
}

const PreviewDetailRow = ({ id, index, shop, coupon, couponDiscount, handleOpenDialog }) => {

    return (
        <Fragment key={`detail-${id}-${index}`}>
            <SpaceTableRow />
            <StyledTableRow className="shop" tabIndex={-1}>
                <StyledTableCell className="preview" align="left" colSpan={5} component="th" scope="row">
                    <Shop><Inventory />&nbsp;Giao từ {shop.shopName}</Shop>
                </StyledTableCell>
            </StyledTableRow>
            {shop.products?.map((product, index) => (
                <ItemRow key={`item-${product.id}-${index}`} {...{ product, index }} />
            ))}
            <StyledTableRow role="coupon-row">
                <StyledTableCell align="left" colSpan={6}>
                    <CouponButton onClick={() => handleOpenDialog(id)}>
                        <span>
                            <LocalActivityOutlined color="error" />&nbsp;
                            {coupon
                                ? couponDiscount
                                    ? `Đã giảm ${couponDiscount.toLocaleString()}đ`
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

export default PreviewDetailRow