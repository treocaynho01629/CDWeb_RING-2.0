const ReviewTable = () => {
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0
    })
    const { loading: loadingReviews, data: reviews } = usePrivateFetch(REVIEWS_URL
        + "?pSize=" + pagination.pageSize
        + "&pageNo=" + pagination.currPage);

    useEffect(() => {
        if (!loadingReviews) {
            setPagination({ ...pagination, totalPages: reviews?.totalPages });
            if (pagination?.currPage > pagination?.pageSize) handlePageChange(1);
        }
    }, [loadingReviews])

    const handlePageChange = (page) => {
        setPagination({ ...pagination, currPage: page - 1 });
    };

    const handleChangeSize = (newValue) => {
        setPagination({ ...pagination, pageSize: newValue, currPage: 0 });
    };

    if (loadingReviews) {
        return (<CustomLinearProgress />)
    }

    return (
        <>
            {reviews?.totalElements == 0 ?
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h3>Bạn chưa có đánh giá nào</h3>
                </Box>
                :
                <Box>
                    {reviews?.content?.map((review, index) => (
                        <Grid key={review.id + ":" + index}>
                            <Review review={review} />
                        </Grid>
                    ))}
                    <AppPagination pagination={pagination}
                        onPageChange={handlePageChange}
                        onSizeChange={handleChangeSize} />
                </Box>
            }
        </>
    )
}

const Review = ({ review }) => {
    const date = new Date(review.date)
    const navigate = useNavigate();

    return (
        <div>
            <Profiler>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box display={{ xs: 'none', md: 'flex' }}>
                        <RatingInfo><Avatar sx={{ width: '20px', height: '20px', marginRight: '5px' }}>A</Avatar>{review.userName}</RatingInfo>
                        <RatingInfo><AccessTimeIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{date.getHours() + ":" + date.getMinutes()}</RatingInfo>
                    </Box>
                    <RatingInfo><CalendarMonthIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</RatingInfo>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RatingInfo style={{ marginRight: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${review.bookId}`)}>
                        Đi đến sản phẩm
                    </RatingInfo>
                    <RatingInfo><StarIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{review.rating}</RatingInfo>
                </Box>
            </Profiler>
            <Box sx={{ margin: '20px 0px 50px' }}>{review.content}</Box>
        </div>
    )
}

const ReviewsDetail = () => {
    return (
        <ContentContainer>
            <Title><TryIcon />&nbsp;ĐÁNH GIÁ CỦA BẠN</Title>
            <ReviewTable />
        </ContentContainer>
    )
}

export default ReviewsDetail