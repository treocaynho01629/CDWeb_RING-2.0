import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon, Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { Avatar, Rating, Box, Grid, TextareaAutosize } from '@mui/material';
import { useNavigate } from "react-router-dom";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import AppPagination from './custom/AppPagination';
import CustomButton from './custom/CustomButton';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useFetch from '../hooks/useFetch'
import useAuth from "../hooks/useAuth";

//#region styled
const RatingSelect = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const RateSelect = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const StyledRating = muiStyled(Rating)(({theme}) => ({
    color: theme.palette.secondary.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.secondary.main,
    },
    '& .MuiRating-iconHover': {
        color: theme.palette.secondary.dark,
    },
}));

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    padding: 0;
    display: flex;
    align-items: center;
    text-transform: uppercase;
`
//#endregion

const Review = ({ review, user }) => {
    const date = new Date(review.date)

    return (
        <div>
            <Profiler style={{ borderBottom: '1px solid', borderColor: user?.userName === review.userName ? '#63e399' : 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RatingInfo><Avatar sx={{ width: '20px', height: '20px', marginRight: '5px' }}>A</Avatar>{review.userName}</RatingInfo>
                    <Box display={{ xs: 'none', sm: 'flex' }}>
                        <RatingInfo><AccessTimeIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{date.getHours() + ":" + date.getMinutes()}</RatingInfo>
                    </Box>
                    <RatingInfo><CalendarMonthIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</RatingInfo>
                </Box>
                <RatingInfo><StarIcon sx={{ fontSize: 18, marginRight: '5px', color: '#63e399' }} />{review.rating}</RatingInfo>
            </Profiler>
            <Box sx={{ margin: '20px 0px 50px' }}>{review.content}</Box>
        </div>
    )
}

const ReviewTab = (props) => {
    //#region construct
    const { id } = props;

    //Initial value
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);

    //Error
    const [err, setErr] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    //Pagination
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0
    });

    //Other
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    //Fetch reviews
    const { loading: loadingReview, data: reviews, refetch } = useFetch(REVIEW_URL + id
        + "?pSize=" + pagination.pageSize
        + "&pageNo=" + pagination.currPage);

    //Set reviews after fetch
    useEffect(() => {
        if (!loadingReview) {
            setPagination({ ...pagination, totalPages: reviews?.totalPages });
            if (pagination?.currPage > pagination?.pageSize) handlePageChange(1);
        }
    }, [loadingReview])

    //Change page
    const handlePageChange = (page) => {
        setPagination({ ...pagination, currPage: page - 1 });
    };

    const handleChangeContent = (event) => {
        setContent(event.target.value);
    };

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        setPagination({ ...pagination, pageSize: newValue });
    };

    //Review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const { enqueueSnackbar } = await import('notistack');

        try {
            const response = await axiosPrivate.post(REVIEW_URL + id,
                JSON.stringify({
                    content: content,
                    rating: rating
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            refetch();
            enqueueSnackbar('Đánh giá thành công!', { variant: 'success' });
            setContent('');
            setErr([]);
            setErrMsg('');
            setRating(5);
            handlePageChange(1);
        } catch (err) {
            console.error(err);
            setErr(err);
            if (!err?.response) {
                setErrMsg("Server không phản hồi!");
            } else if (err.response?.status === 400) {
                setErrMsg(err.response.data.errors.content);
            } else if (err.response?.status === 409) {
                setErrMsg(err.response.data.errors.errorMessage);
            } else {
                setErrMsg("Đánh giá thất bại!");
            }
            enqueueSnackbar('Đánh giá thất bại!', { variant: 'error' });
        }
    }

    //Review
    let review;
    if (loadingReview) {
        review = <CustomLinearProgress sx={{ marginBottom: 5 }} />
    } else if (reviews?.totalElements != 0) {
        review =
            <Box>
                {reviews?.content?.map((review, index) => (
                    <Grid key={index}>
                        <Review review={review} user={auth} />
                    </Grid>
                ))}
                <AppPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Box>
    } else {
        review = <Box sx={{ marginBottom: 5 }}>Chưa có ai bình luận, hãy trở thành người đầu tiên!</Box>
    }
    //#endregion

    return (
        <>
            {review}
            <Box>
                {auth.userName ? (err?.response?.data?.code === 208 ?
                    <Box>
                        <Box><strong style={{ fontSize: '16px' }}>{errMsg}</strong></Box>
                        <br />
                        <CustomButton
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => navigate('/login')}
                        >
                            Xem đánh giá
                        </CustomButton>
                    </Box>
                    : err?.response?.data?.code === 204 ?
                        <Box>
                            <Box><strong style={{ fontSize: '16px' }}>{errMsg}</strong></Box>
                            <br />
                            <CustomButton
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => scrollTo(0, 0)}
                            >
                                Mua ngay
                            </CustomButton>
                        </Box>
                        :
                        <Box>
                            <Box><strong style={{ fontSize: '16px', color: errMsg && !content ? 'red' : 'black' }}>
                                {errMsg ? errMsg : "Để lại đánh giá của bạn"}
                            </strong></Box>
                            <form onSubmit={handleSubmitReview}>
                                <TextareaAutosize
                                    aria-label="comment"
                                    minRows={7}
                                    value={content}
                                    onChange={handleChangeContent}
                                    placeholder="Đánh giá của bạn ..."
                                    style={{
                                        width: '100%',
                                        margin: '30px 0px',
                                        backgroundColor: 'white',
                                        outline: 'none',
                                        borderRadius: '0',
                                        resize: 'none',
                                        color: 'black',
                                        borderColor: err?.response?.data?.errors?.content && !content ? 'red' : 'black',
                                        fontSize: '16px'
                                    }}
                                />
                                <RatingSelect>
                                    <RateSelect>
                                        <strong>Đánh giá: </strong>
                                        <StyledRating
                                            sx={{ marginLeft: '5px' }}
                                            name="product-rating"
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                            icon={<StarIcon fontSize="10px" />}
                                            emptyIcon={<StarBorderIcon fontSize="10" />}
                                        />
                                    </RateSelect>
                                    <CustomButton
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                    >
                                        Gửi đánh giá
                                    </CustomButton>
                                </RatingSelect>
                            </form>
                        </Box>
                )
                    :
                    <Box>
                        <Box><strong style={{ fontSize: '16px' }}>Bạn chưa đăng nhập, hãy Đăng nhập để đánh giá</strong></Box>
                        <br />
                        <CustomButton
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập ngay
                        </CustomButton>
                    </Box>
                }
            </Box>
        </>
    )
}

export default ReviewTab