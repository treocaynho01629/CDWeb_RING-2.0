import styled from "styled-components"
import { Fragment, useState } from 'react';
import { useGetOrdersByUserQuery } from '../../features/orders/ordersApiSlice';
import { Check, DeliveryDiningOutlined, KeyboardArrowLeft, KeyboardArrowRight, MoreHoriz, Receipt, Storefront } from '@mui/icons-material';
import { Box, Button, Skeleton } from '@mui/material';
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Title } from "../custom/GlobalComponents";
import { booksApiSlice } from "../../features/books/booksApiSlice";
import { debounce } from "lodash-es";
import CustomProgress from '../custom/CustomProgress';
import useCart from '../../hooks/useCart';

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

const StatusTag = styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-weight: 450;
    color: ${props => props.theme.palette.primary.dark};

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

const OrdersContainer = styled.div`
`
//#endregion

const defaultSize = 5;

function OrderItem({ order, handleAddToCart }) {

    return (
        <>
            {order?.details?.map((detail, index) => {
                const isCompleted = detail?.items.every(item => item.status == 'COMPLETED');

                return (
                    <OrderItemContainer key={`order-${detail?.id}-${index}`}>
                        <HeadContainer>
                            <Link to={`/store/${detail?.shopId}`}>
                                <Shop>
                                    <ShopTag>Đối tác</ShopTag>
                                    <Storefront />&nbsp;{detail?.shopName}<KeyboardArrowRight fontSize="small" />
                                </Shop>
                            </Link>
                            <Link to={`/profile/order/detail${detail?.id}`}>
                                <StatusTag>
                                    {isCompleted ? <><Check />ĐÃ GIAO</> : <><MoreHoriz />ĐANG GIAO</>}
                                </StatusTag>
                            </Link>
                        </HeadContainer>
                        {detail?.items?.map((item, itemIndex) => (
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
                            <Link to={`/profile/order/detail${detail?.id}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <DetailText><DeliveryDiningOutlined />&nbsp;Chi tiết đơn hàng</DetailText>
                            </Link>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                    <p style={{ margin: 0 }}>Thành tiền:</p>
                                    <Price className="total">&nbsp;{(detail?.totalPrice - detail?.totalDiscount).toLocaleString()}đ</Price>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Link to={`/product/${detail?.slug}`}>
                                    </Link>
                                    <Button variant="contained" color="primary" onClick={() => handleAddToCart(detail)}>
                                        Mua lại
                                    </Button>
                                    <Link to={`/product/${detail?.items[0]?.bookSlug}?review=true`}>
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
            )}
        </>

    )
}

const OrdersList = () => {
    const { addProduct } = useCart();
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: defaultSize,
        isMore: true,
    })

    //Fetch orders
    const { data, isLoading, isSuccess, isError, error } = useGetOrdersByUserQuery({
        page: pagination?.currPage,
        size: pagination?.pageSize,
        loadMore: pagination?.isMore
    });
    const [getBought] = booksApiSlice.useLazyGetBooksByIdsQuery();

    const handleAddToCart = async (detail) => {
        const ids = detail?.items?.map(item => item.bookId);
        getBought(ids) //Fetch books with new info
            .unwrap()
            .then((books) => {
                const { ids, entities } = books;

                ids.forEach((id) => {
                    const book = entities[id];
                    if (book.amount > 0) { //Check for stock
                        addProduct(book, 1);
                    } else {
                        async function alert() {
                            const { enqueueSnackbar } = await import('notistack');
                            enqueueSnackbar('Sản phẩm đã hết hàng!', { variant: 'error' });
                        }
                        alert();
                    }
                })
            })
            .catch((rejected) => console.error(rejected));
    };

    //Show more
    const handleShowMore = () => {
        let currPage = (pagination?.currPage || 0) + 1;
        if (data?.info?.totalPages > currPage) {
            setPagination({ ...pagination, currPage });
        }
    }

    const handleScroll = (e) => {
        const trigger = document.body.scrollHeight - 300 < window.scrollY + window.innerHeight;
        if (trigger) handleShowMore();
    }

    window.addEventListener("scroll", debounce(handleScroll, 500));

    let ordersContent;

    if (isLoading) {
        ordersContent = <CustomProgress color="primary" />
    } else if (isSuccess) {
        const { ids, entities } = data;

        ordersContent = ids?.length
            ? ids?.map((id, index) => {
                const order = entities[id];

                return (
                    <Fragment key={`order-${id}-${index}`}>
                        <OrderItem {...{ order, handleAddToCart }} />
                    </Fragment>
                )
            })
            :
            <Box sx={{ marginBottom: 5 }}>Chưa có đơn hàng nào</Box>
    } else if (isError) {
        ordersContent = <Box sx={{ marginBottom: 5 }}>{error?.error}</Box>
    }

    return (
        <>
            <Title className="primary">
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Receipt />&nbsp;ĐƠN HÀNG CỦA BẠN
            </Title>
            <OrdersContainer>
                {ordersContent}
                {isLoading && <p>FIX</p>}
            </OrdersContainer>
        </>
    )
}

export default OrdersList