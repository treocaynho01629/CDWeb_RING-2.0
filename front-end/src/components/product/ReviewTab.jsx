import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon, Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { Avatar, Rating, Box, Grid, Button, TextField, MenuItem } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import { useCreateReviewMutation, useGetReviewsByBookIdQuery } from '../../features/reviews/reviewsApiSlice';
import AppPagination from '../custom/AppPagination';
import useAuth from "../../hooks/useAuth";
import CustomProgress from '../custom/CustomProgress';

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

const SuggestText = styled.b`
    font-size: 16px;
    color: ${props => props.theme.palette.text.primary};

    &.error {
        font-style: italic;
        color: ${props => props.theme.palette.error.main};
    }
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.primary.main,
    },
    '& .MuiRating-iconHover': {
        color: theme.palette.primary.light,
    },
}));

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid transparent;

    &.active {
        border-color: ${props => props.theme.palette.primary.main};
    }
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    padding: 0;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    
    ${props => props.theme.breakpoints.down("sm")} {
        max-width: 95px;
    }

    &:last-child {
        margin-right: 0;
    }
`

const StyledTextarea = styled.textarea`
  width: 100%;
  margin: 30px 0px;
  font-size: 16px;
  background-color: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.text.primary};
  outline: none;
  resize: none;
  border-color: ${props => props.theme.palette.text.primary};

  -ms-overflow-style: none;
  scrollbar-width: none; 

  &::-webkit-scrollbar {
      display: none;
  }

  &.error {
    border-color: ${props => props.theme.palette.error.main};
  }
`
//#endregion

const Review = ({ review, username }) => {
    const date = new Date(review?.date);

    return (
        <>
            <Profiler className={username === review?.userName ? 'active' : ''}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RatingInfo><Avatar sx={{ width: '20px', height: '20px', marginRight: '5px' }}>{review?.userName?.charAt(0) ?? 'A'}</Avatar>{review?.userName}</RatingInfo>
                    <Box display={{ xs: 'none', sm: 'flex' }}>
                        <RatingInfo><AccessTimeIcon sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                            {`${('0' + date?.getHours()).slice(-2)}:${('0' + date?.getMinutes()).slice(-2)}`}
                        </RatingInfo>
                    </Box>
                    <RatingInfo><CalendarMonthIcon sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                        {`${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`}
                    </RatingInfo>
                </Box>
                <RatingInfo><StarIcon sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />{review.rating}</RatingInfo>
            </Profiler>
            <Box sx={{ margin: '20px 0px 50px' }}>{review?.content}</Box>
        </>
    )
}

const ReviewTab = ({ id, scrollIntoTab }) => {
    //#region construct
    const { username } = useAuth();
    const location = useLocation();

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

    //Fetch reviews
    const { data, isLoading, isSuccess, isError, error } = useGetReviewsByBookIdQuery({
        id,
        page: pagination?.currPage,
        size: pagination?.pageSize
    }, { skip: !id })

    //Review hook
    const [review, { isLoading: reviewing }] = useCreateReviewMutation();

    //Set reviews after fetch
    useEffect(() => {
        if (!isLoading && isSuccess && data) {
            setPagination({
                ...pagination,
                totalPages: data?.info?.totalPages,
                currPage: data?.info?.currPage,
                pageSize: data?.info?.pageSize
            });
        }
    }, [data])

    //Change page
    const handlePageChange = (page) => {
        setPagination({ ...pagination, currPage: page - 1 });
        scrollIntoTab();
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
        if (reviewing) return;

        const { enqueueSnackbar } = await import('notistack');

        review({
            id,
            newReview: {
                content: content,
                rating: rating
            },
        }).unwrap()
            .then((data) => {
                enqueueSnackbar('Đánh giá thành công!', { variant: 'success' });
                setContent('');
                setErr([]);
                setErrMsg('');
                setRating(5);
                handlePageChange(1);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg("Server không phản hồi!");
                } else if (err?.status === 400) {
                    setErrMsg(err.data.errors.content);
                } else if (err?.status === 409) {
                    setErrMsg(err.data.errors.errorMessage);
                } else {
                    setErrMsg("Đánh giá thất bại!");
                }
                enqueueSnackbar('Đánh giá thất bại!', { variant: 'error' });
            })
    }

    //Review
    let reviewsContent;

    if (isLoading) {
        reviewsContent =
            <>
                <CustomProgress color="primary" />
                <br /><br />
            </>
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = ids?.length
            ?
            <Box>
                {ids?.map((id, index) => {
                    const review = entities[id];

                    return (
                        <Grid key={`${id}-${index}`}>
                            <Review {...{ username, review }} />
                        </Grid>
                    )
                })
                }
                <AppPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Box>
            :
            <Box sx={{ marginBottom: 5 }}>Chưa có ai bình luận, hãy trở thành người đầu tiên!</Box>
    } else if (isError) {
        reviewsContent = <Box sx={{ marginBottom: 5 }}>{error?.error}</Box>
    }
    //#endregion

    return (
        <>
            {reviewsContent}
            <Box>
                {username ? (err?.data?.code === 208 ?
                    <Box>
                        <Box><strong style={{ fontSize: '16px' }}>{errMsg}</strong></Box>
                        <br />
                        <Link to={'/login'} state={{ from: location }} replace title="Đăng nhập">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Xem đánh giá
                            </Button>
                        </Link>
                    </Box>
                    : err?.data?.code === 204 ?
                        <Box>
                            <Box><strong style={{ fontSize: '16px' }}>{errMsg}</strong></Box>
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => scrollTo(0, 0)}
                            >
                                Mua ngay
                            </Button>
                        </Box>
                        :
                        <Box>
                            <Box>
                                <SuggestText className={`${errMsg && !content ? 'error' : ''}`}>
                                    {errMsg ? errMsg : "Để lại đánh giá của bạn"}
                                </SuggestText>
                            </Box>
                            <form onSubmit={handleSubmitReview}>
                                <StyledTextarea
                                    aria-label="comment-content"
                                    rows={7}
                                    value={content}
                                    onChange={handleChangeContent}
                                    placeholder="Đánh giá của bạn ..."
                                    className={`${err?.data?.errors?.content && !content ? 'error' : ''}`}
                                />
                                <RatingSelect>
                                    <RateSelect>
                                        <SuggestText>Đánh giá: </SuggestText>
                                        <StyledRating
                                            sx={{ marginLeft: 1, display: { xs: 'none', sm: 'flex' } }}
                                            name="product-rating"
                                            value={rating}
                                            onChange={(e, newValue) => { setRating(newValue) }}
                                            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                            icon={<StarIcon fontSize="10px" />}
                                            emptyIcon={<StarBorderIcon fontSize="10" />}
                                        />
                                        <TextField
                                            size="small"
                                            select
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            sx={{ marginLeft: 1, display: { xs: 'block', sm: 'none' } }}
                                            InputProps={{
                                                startAdornment: <StarIcon fontSize="10px" color="primary" sx={{ marginRight: 1 }} />,
                                            }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                        </TextField>
                                    </RateSelect>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >
                                        Gửi đánh giá
                                    </Button>
                                </RatingSelect>
                            </form>
                        </Box>
                )
                    :
                    <Box>
                        <Box><SuggestText>Bạn chưa đăng nhập, hãy Đăng nhập để đánh giá</SuggestText></Box>
                        <br />
                        <Link to={'/login'} state={{ from: location }} replace title="Đăng nhập">
                            <Button
                                variant="contained"
                                color="primary"
                            >
                                Đăng nhập ngay
                            </Button>
                        </Link>
                    </Box>
                }
            </Box>
        </>
    )
}

export default ReviewTab