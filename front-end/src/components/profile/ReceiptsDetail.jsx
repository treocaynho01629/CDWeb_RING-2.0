import React from 'react'

const ReceiptsTable = () => {
    const [count, setCount] = useState(1);
    const [receipts, setReceipts] = useState([]);
    const { addProduct } = useCart();
    const { loading: loadingReceipts, data: dataReceipts } = usePrivateFetch(RECEIPTS_URL + "&pageNo=" + 0);
    const { loading: loadingMore, data: more } = usePrivateFetch(RECEIPTS_URL + "&pageNo=" + count);

    const handleAddToCart = (book) => {
        addProduct({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1,
        })
    };

    //Load
    useEffect(() => {
        if (!loadingReceipts) {
            setReceipts(current => [...current, ...dataReceipts?.content]);
        }
    }, [loadingReceipts]);

    const handleShowMoreReceipts = async () => {
        if (!loadingMore && more) {
            setReceipts(current => [...current, ...more?.content]);
            setCount(prev => prev + 1);
        }
    }

    if (loadingReceipts) {
        return (<CustomLinearProgress />)
    }

    return (
        <>
            {dataReceipts?.totalElements == 0 ?
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h3>Bạn chưa mua sản phẩm nào</h3>
                </Box>
                :
                <div>
                    <TableContainer component={Paper} sx={{ borderRadius: '0%' }} >
                        <Table sx={{ minWidth: 500, borderRadius: '0%' }} aria-label="cart-table">
                            <TableBody>
                                {receipts?.map((receipt) => {
                                    return (
                                        receipt?.orderDetails?.map((detail, index) => {
                                            return (
                                                <>
                                                    <TableRow key={detail.id + "a" + index} sx={{ backgroundColor: '#f7f7f7' }}>
                                                        <TableCell colSpan={1}><ItemTitle>Giao tới: {receipt.address}</ItemTitle></TableCell>
                                                        <TableCell align="right"><StatusTag><CheckIcon />ĐÃ GIAO</StatusTag></TableCell>
                                                    </TableRow>
                                                    <TableRow key={detail.id + "b" + index}>
                                                        <TableCell>
                                                            <div style={{ display: 'flex' }}>
                                                                <Link to={`/product/${detail.bookId}`} style={{ color: 'inherit' }}>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <LazyLoadImage src={detail.image}
                                                                            height={90}
                                                                            width={90}
                                                                            style={{
                                                                                border: '0.5px solid lightgray',
                                                                                objectFit: 'contain'
                                                                            }}
                                                                        />
                                                                        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                                                                            <ItemTitle>{detail.bookTitle}</ItemTitle>
                                                                            <p>Số lượng: {detail.amount}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Price>{detail.price.toLocaleString()} đ</Price>
                                                            <Discount>{Math.round(detail.price * 1.1).toLocaleString()} đ</Discount>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={detail.id + "c" + index}>
                                                        <TableCell colSpan={1} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${detail.bookId}`)}>Đánh giá sản phẩm?</TableCell>
                                                        <TableCell align="right">
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                                                <b style={{ margin: 0 }}>Tổng:</b>
                                                                <Price>&nbsp;&nbsp;{(detail.price * detail.amount).toLocaleString()} đ</Price>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <Button onClick={() => handleAddToCart(detail)} style={{ marginRight: 0 }}>MUA LẠI</Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <br />
                                                </>
                                            )
                                        })
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{
                        display: more?.last ? 'none' : 'flex',
                        justifyContent: 'center',
                        margin: '20px 0px'
                    }}>
                        <Button onClick={handleShowMoreReceipts}>Xem thêm</Button>
                    </div>
                </div>
            }
        </>
    )
}

const ReceiptsDetail = () => {
    return (
        <ContentContainer>
            <Title><ReceiptIcon />&nbsp;ĐƠN HÀNG CỦA BẠN</Title>
            <ReceiptsTable />
        </ContentContainer>
    )
}

export default ReceiptsDetail