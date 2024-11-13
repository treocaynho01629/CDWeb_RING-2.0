import styled from "styled-components"
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { DeliveryDiningOutlined, KeyboardArrowRight, Storefront } from '@mui/icons-material';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getStatus } from "../../ultils/order"
import { Link } from "react-router-dom";

//#region styled
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

const StatusTag = styled(Typography)`
    text-transform: uppercase;
    font-weight: 450;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
    }
`

const DetailText = styled.p`
    margin: 0;
    font-weight: 350;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-decoration: underline;
    color: ${props => props.theme.palette.primary.dark};
`

const Amount = styled.span`
    font-size: 14px;
    font-weight: 450;
    margin-right: ${props => props.theme.spacing(2)};
    color: ${props => props.theme.palette.text.secondary};

    b {
        color: ${props => props.theme.palette.warning.main};
    }
`

const ContentContainer = styled.div`
    margin-left: 10px;
    width: 100%;
    max-height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const StuffContainer = styled.div`
    display: flex;
    justify-content: space-between;

    ${props => props.theme.breakpoints.down("sm")} {
        flex-direction: row-reverse;
    }
`

const PriceContainer = styled.div`
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

const OrderItemContainer = styled.div`
    border: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};
    margin-bottom: ${props => props.theme.spacing(2)};
`

const HeadContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing(2)};
    border-bottom: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        padding: ${props => props.theme.spacing(1)};
    }
`

const BodyContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    padding: ${props => props.theme.spacing(2)};

    ${props => props.theme.breakpoints.down("sm")} {
        padding: ${props => props.theme.spacing(1)};
    }
`

const BotContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing(2)};
    border-top: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        padding: ${props => props.theme.spacing(1)};
        font-size: 14px;
        align-items: flex-start;
    }
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
//#endregion

const OrderItem = ({ order, handleAddToCart }) => {
    const detailStatus = getStatus(order?.status);

    return (
        <OrderItemContainer>
            <HeadContainer>
                <Link to={`/store/${order?.shopId}`}>
                    <Shop>
                        <ShopTag>Đối tác</ShopTag>
                        <Storefront />&nbsp;{order?.shopName}<KeyboardArrowRight fontSize="small" />
                    </Shop>
                </Link>
                <Link to={`/profile/order/detail${order?.id}`}>
                    <StatusTag color={detailStatus.color}>{detailStatus.status}</StatusTag>
                </Link>
            </HeadContainer>
            {order?.items?.map((item, itemIndex) => (
                <Link key={`item-${item?.id}-${itemIndex}`} to={`/product/${item?.bookSlug}`}>
                    <BodyContainer>
                        <StyledLazyImage
                            src={`${item?.image}?size=small`}
                            alt={`${item?.bookTitle} Order item`}
                            placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                        />
                        <ContentContainer>
                            <ItemTitle>{item?.bookTitle}</ItemTitle>
                            <StuffContainer>
                                <Amount>Số lượng: <b>{item?.quantity}</b></Amount>
                                <PriceContainer>
                                    <Discount>{item?.discount > 0 ? `${item.price.toLocaleString()}đ` : ''}</Discount>
                                    <Price>{Math.round(item.price * (1 - (item?.discount || 0))).toLocaleString()}đ</Price>
                                </PriceContainer>
                            </StuffContainer>
                        </ContentContainer>
                    </BodyContainer>
                </Link>
            ))}
            <BotContainer>
                <Link to={`/profile/order/detail${order?.id}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <DetailText><DeliveryDiningOutlined />&nbsp;Chi tiết đơn hàng</DetailText>
                </Link>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                        <p style={{ margin: 0 }}>Thành tiền:</p>
                        <Price className="total">&nbsp;{(order?.totalPrice - order?.totalDiscount).toLocaleString()}đ</Price>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={`/product/${order?.slug}`}>
                        </Link>
                        <Button variant="contained" color="primary" onClick={() => handleAddToCart(order)}>
                            Mua lại
                        </Button>
                        <Link to={`/product/${order?.items[0]?.bookSlug}?review=true`}>
                            <Button variant="outlined" color="secondary" sx={{ marginLeft: '10px' }}>
                                Đánh giá
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </BotContainer>
        </OrderItemContainer>
    )
}

export default OrderItem