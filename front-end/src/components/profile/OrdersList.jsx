import styled from "styled-components"
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useGetOrdersByUserQuery } from '../../features/orders/ordersApiSlice';
import { DeliveryDiningOutlined, KeyboardArrowLeft, KeyboardArrowRight, Receipt, Search, Storefront } from '@mui/icons-material';
import { Box, Button, CircularProgress, Skeleton, TextField, Typography } from '@mui/material';
import { Link, useSearchParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Title } from "../custom/GlobalComponents";
import { booksApiSlice } from "../../features/books/booksApiSlice";
import { CustomTab, CustomTabs } from "../custom/CustomTabs";
import { orderStatus } from "../../ultils/filters";
import { getStatus } from '../../ultils/order';
import { debounce } from "lodash-es";
import useCart from '../../hooks/useCart';
import useDeepEffect from "../../hooks/useDeepEffect";

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

const OrdersContainer = styled.div`
`

const ToggleGroupContainer = styled.div`
    width: 100%;
    background-color: ${props => props.theme.palette.background.default};
    border-bottom: 1px solid ${props => props.theme.palette.divider};
    white-space: nowrap;
    padding: 0 10px;
    position: sticky; 
    top: ${props => props.theme.mixins.toolbar.minHeight + 16.5}px;
    z-index: 1;

    ${props => props.theme.breakpoints.down("sm")} {
        top: ${props => props.theme.mixins.toolbar.minHeight + 4.5}px;
    }

    &:before{
        content: "";
        position: absolute;
        left: 0;
        top: -16px;
        width: 100%;
        height: calc(100% + 16px);
        background-color: ${props => props.theme.palette.background.default};
        z-index: -1;
    }

    &::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${props => props.theme.palette.action.hover};
        z-index: -1;
    }
`

const PlaceholderContainer = styled.div`
    padding: ${props => props.theme.spacing(16)};
`

const LoadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: ${props => props.theme.spacing(2)};
`
//#endregion

const defaultSize = 5;

function OrderItem({ order, handleAddToCart }) {
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

const OrdersList = () => {
    const { addProduct } = useCart();
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        status: searchParams.get('status') ?? '',
        keyword: searchParams.get('q') ?? ''
    })
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: defaultSize,
        totalPages: 0,
        isMore: true,
    })

    //Fetch orders
    const { data, isLoading, isFetching, isSuccess, isError, error } = useGetOrdersByUserQuery({
        status: filters?.status,
        keyword: filters?.keyword,
        page: pagination?.currPage,
        size: pagination?.pageSize,
        loadMore: pagination?.isMore
    });
    const [getBought] = booksApiSlice.useLazyGetBooksByIdsQuery();

    useDeepEffect(() => { updatePath(); }, [filters]);

    useEffect(() => {
        if (data && !isLoading && isSuccess) {
            setPagination({
                ...pagination,
                currPage: data.info.currPage,
                totalPages: data.info.totalPages
            });
        }
    }, [data])

    const scrollToTop = useCallback(() => { scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [])

    //Change tab
    const handleChangeStatus = useCallback((e, newValue) => {
        setFilters(prev => ({ ...prev, status: newValue }));
        handleResetPagination();
    }, []);
    const handleChangeKeyword = useCallback((e) => {
        e.preventDefault();
        if (inputRef) setFilters(prev => ({ ...prev, keyword: inputRef.current.value }));
        handleResetPagination();
    }, []);

    const handleResetPagination = useCallback(() => {
        setPagination(prev => ({ ...prev, currPage: 0 }));
        scrollToTop();
    }, [])

    //Search params
    const updatePath = () => {
        filters?.status == '' ? searchParams.delete("status") : searchParams.set("status", filters.status);
        filters?.keyword == '' ? searchParams.delete("q") : searchParams.set("q", filters.keyword);
        setSearchParams(searchParams);
    }

    //Rebuy
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
        if (isFetching || typeof data?.info?.currPage !== 'number') return;
        if (data?.info?.currPage < pagination?.currPage) return;
        const nextPage = data?.info?.currPage + 1;
        if (nextPage < data?.info?.totalPages) setPagination(prev => ({ ...prev, currPage: nextPage }));
    }

    const handleScroll = (e) => {
        const trigger = document.body.scrollHeight - 300 < window.scrollY + window.innerHeight;
        if (trigger) handleShowMore();
    }

    const scrollListener = useCallback(debounce(handleScroll, 500), [data]);

    window.addEventListener("scroll", scrollListener);

    let ordersContent;

    if (isLoading || (isFetching && pagination.currPage == 0)) {
        ordersContent =
            <PlaceholderContainer>
                <LoadContainer>
                    <CircularProgress color="primary" />
                </LoadContainer>
            </PlaceholderContainer>
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
            <Title ref={scrollRef} className="primary">
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Receipt />&nbsp;ĐƠN HÀNG CỦA BẠN
            </Title>
            <ToggleGroupContainer>
                <CustomTabs value={filters.status} onChange={handleChangeStatus} variant="scrollable" scrollButtons={false}>
                    {orderStatus.map((tab, index) => (
                        <CustomTab key={`tab-${index}`} label={tab.label} value={tab.value} />
                    ))}
                </CustomTabs>
            </ToggleGroupContainer>
            <form onSubmit={handleChangeKeyword}>
                <TextField
                    placeholder='Tìm kiếm theo mã đơn hàng, Tên Shop hoặc Tên sản phẩm'
                    autoComplete="order"
                    id="order"
                    size="small"
                    defaultValue={searchParams.get("q")}
                    inputRef={inputRef}
                    fullWidth
                    error={inputRef?.current?.value != filters.keyword}
                    sx={{ py: { xs: 1, md: 2 } }}
                    slotProps={{
                        input: {
                            startAdornment: (< Search sx={{ marginRight: 1 }} />)
                        },
                    }}
                />
            </form>
            <OrdersContainer>
                {ordersContent}
                {(pagination.currPage > 0 && isFetching) && <LoadContainer><CircularProgress color="primary" /></LoadContainer>}
            </OrdersContainer>
        </>
    )
}

export default OrdersList