import styled from "styled-components"
import { useState } from 'react';
import { useGetOrdersByUserQuery } from '../../features/orders/ordersApiSlice';
import { Check, DeliveryDining, Receipt, Storefront } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CustomProgress from '../custom/CustomProgress';
import useCart from '../../hooks/useCart';

//#region styled
const ItemTitle = styled.p`
    font-size: 16px;
    font-weight: 500;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 0;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
    }
`

const SellerTag = styled.p`
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
    display: flex;
    align-items: center;
    margin: 0;
    padding: 2px 10px;
    margin-right: 10px;
`

const StatusTag = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    font-weight: bold;
    padding-left: 5px;
    margin-left: 10px;
    border-left: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};
    color: ${props => props.theme.palette.primary.main};
`

const DetailText = styled.p`
    margin: 0;
    font-weight: 350;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: ${props => props.theme.palette.primary.dark};
`

const Amount = styled.p`
    font-size: 14px;
    font-weight: bold;

    &.alt {
        display: none;
        
        ${props => props.theme.breakpoints.down("sm")} {
            display: block;
        }
    }
`

const Price = styled.p`
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    color: ${props => props.theme.palette.text.secondary};

    &.total {
        font-size: 16px;
        color: ${props => props.theme.palette.primary.main};
    }
`

const OrderItemContainer = styled.div`
    border: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};
    margin-bottom: 15px;
`

const HeadContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    font-size: 16px;
    border-bottom: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};
    background-color: ${props => props.theme.palette.action.hover};

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
        svg { font-size: 18px;}
    }
`

const BodyContainer = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const BotContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-top: .5px solid;
    border-color: ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
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
//#endregion

const defaultSize = 5;

const OrdersList = ({ Title }) => {
    const { addProduct } = useCart();
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: defaultSize,
        isMore: true,
    })

    //Fetch orders
    const { data: orders, isLoading, isSuccess } = useGetOrdersByUserQuery({
        page: pagination?.currPage,
        size: pagination?.pageSize,
        loadMore: pagination?.isMore
    });

    const handleAddToCart = (detail) => {
        addProduct({
            id: detail.bookId,
            title: detail.bookTitle,
            price: detail.price,
            image: detail.image,
            quantity: 1,
        })
    };

    //Show more
    const handleShowMore = () => {
        let nextPage = (orders?.ids?.length / defaultSize);
        setPagination({ ...pagination, currPage: nextPage })
    }

    let ordersContent;

    if (isLoading) {
        ordersContent =
            <>
                <CustomProgress color="primary" />
                <br /><br />
            </>
    } else if (isSuccess) {
        const { ids, entities } = orders;

        ordersContent = ids?.length
            ? ids?.map((id) => {
                const order = entities[id];

                return (
                    order?.orderDetails?.map((detail, index) => (
                        <OrderItemContainer key={`${detail.id}-${index}`}>
                            <HeadContainer>
                                <Link to={`/filters?seller=${detail.sellerName}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                    <SellerTag>Đối tác&nbsp;<Check fontSize="small" /></SellerTag>
                                    {detail.sellerName}
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            display: { xs: 'none', md_lg: 'flex' },
                                            marginLeft: '10px',
                                            paddingLeft: '7px',
                                            paddingRight: '7px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        startIcon={<Storefront />}
                                    >
                                        Xem Shop
                                    </Button>
                                </Link>
                                <Link to={`/profile/orders/${order.id}--${detail.id}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                    <StatusTag><Check />ĐÃ GIAO</StatusTag>
                                </Link>
                            </HeadContainer>
                            <Link to={`/product/${detail.bookId}`} style={{ color: 'inherit' }}>
                                <BodyContainer>
                                    <Box display={'flex'}>
                                        <StyledLazyImage
                                            src={`${detail.image}?size=small`}
                                            alt={`${detail.title}`}
                                        />
                                        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                                            <ItemTitle>{detail.bookTitle}</ItemTitle>
                                            <Amount>Số lượng: {detail.amount}</Amount>
                                        </div>
                                    </Box>
                                    <Box display={{ xs: 'none', sm: 'block' }}>
                                        <Price>{detail.price.toLocaleString()}đ</Price>
                                    </Box>
                                </BodyContainer>
                            </Link>
                            <BotContainer>
                                <Link to={`/profile/orders/${order.id}--${detail.id}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                    <DetailText><DeliveryDining />&nbsp;Chi tiết đơn hàng</DetailText>
                                </Link>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                        <p style={{ margin: 0 }}>Thành tiền:</p>
                                        <Price className="total">&nbsp;{(detail.price * detail.amount).toLocaleString()}đ</Price>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddToCart(detail)}
                                        >
                                            Mua lại
                                        </Button>
                                        <Box display={{ xs: 'none', sm: 'block' }}>
                                            <Link to={`/product/${detail.bookId}?tab=reviews`}>
                                                <Button variant="outlined" sx={{ marginLeft: '10px' }}>
                                                    Đánh giá sản phẩm
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Box>
                            </BotContainer>
                        </OrderItemContainer>
                    ))
                )
            })
            :
            <Box sx={{ marginBottom: 5 }}>Chưa có đơn hàng nào</Box>
    } else if (isError) {
        ordersContent = <Box sx={{ marginBottom: 5 }}>{error?.error}</Box>
    }

    return (
        <>
            <Title><Receipt />&nbsp;ĐƠN HÀNG CỦA BẠN</Title>
            {ordersContent}
            {/* <div style={{
                        display: more?.last ? 'none' : 'flex',
                        justifyContent: 'center',
                        margin: '20px 0px'
                    }}>
                        <Button onClick={handleShowMore}>Xem thêm</Button>
                    </div> */}
        </>
    )
}

export default OrdersList