import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { styled as muiStyled } from '@mui/system';
import { AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon, Star as StarIcon, StarBorder as StarBorderIcon, ReportGmailerrorred } from '@mui/icons-material';
import { Avatar, Rating, Box, Button, TextField, MenuItem, LinearProgress } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import { useCreateReviewMutation, useGetReviewsByBookIdQuery } from '../../../features/reviews/reviewsApiSlice';
import { Title } from '../../custom/GlobalComponents';
import AppPagination from '../../custom/AppPagination';
import CustomProgress from '../../custom/CustomProgress';
import useAuth from "../../../hooks/useAuth";

//#region styled
const ReviewsContainer = styled.div`
  padding: 10px 20px;
  border: .5px solid ${props => props.theme.palette.divider};

  ${props => props.theme.breakpoints.down("md")} {
    padding: 10px 12px;
  }
`

const RatingSelect = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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

    &.label {
        font-size: 14px;
        font-weight: 300;
        margin-left: 5px;
    }

    &.hide-on-mobile {
        ${props => props.theme.breakpoints.down("md")} {
            display: none;
        }
    }
`

const StyledRating = muiStyled(Rating)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: theme.palette.warning.light,
    },
    '& .MuiRating-iconHover': {
        color: theme.palette.warning.main,
    },
}));

const Profile = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: .5px solid transparent;
    padding: 15px 0 10px;

    &.active {
        border-color: ${props => props.theme.palette.primary.main};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 10px 0 5px;
    }
`

const RateContent = styled.div`
    margin: 10px 0 20px;
    font-size: 15px;

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 5px 0 20px;
    }
`

const ReportButton = styled.span`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};
    opacity: .9;
    font-size: 14px;
    cursor: pointer;

    &.mobile { display: none;}

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
        &.mobile { display: flex;} 
    }
`

const RatingInfo = styled.p`
    font-size: 14px;
    padding: 0;
    margin: 0;
    margin-right: 10px;
    font-weight: 400;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    
    ${props => props.theme.breakpoints.down("sm")} {
        max-width: 95px;
        &.time {display: none;}
    }

    &:last-child {margin-right: 0;}
`

const StyledTextarea = styled.textarea`
  width: 100%;
  margin: 20px 0px 10px;
  font-size: 16px;
  background-color: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.text.primary};
  outline: none;
  resize: none;
  border-color: ${props => props.theme.palette.divider};

  -ms-overflow-style: none;
  scrollbar-width: none; 

  &::-webkit-scrollbar {
      display: none;
  }

  &.error {
    border-color: ${props => props.theme.palette.error.main};
  }
`

const ReviewsSummary = styled.div`
    display: flex;
    margin-top: 15px;
    text-transform: none;
`

const ScoreContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0 20px;
    margin-left: 10px;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0;
    }
`

const Score = styled.h1`
    margin: 0;
    b { font-size: 30px;}
`

const TotalLabel = styled.span`
    margin: 5px 0;
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
`

const ProgressLabel = styled.span`
    font-size: 14px;
`
//#endregion

const labels = {
    1: 'Cực tệ',
    2: 'Tệ',
    3: 'Ổn',
    4: 'Hài lòng',
    5: 'Cực hài lòng',
};

function LinearProgressWithLabel(props) {
    const { label, value, ...otherProps } = props;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ minWidth: 45 }}>
                <ProgressLabel>{label}</ProgressLabel>
            </Box>
            <Box sx={{ width: '100%', mr: 1, color: 'warning.light' }}>
                <LinearProgress color="inherit" variant="determinate" value={Math.round(value)} {...otherProps} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <ProgressLabel>{`${Math.round(value)}%`}</ProgressLabel>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

const Review = ({ review, username }) => {
    const date = new Date(review?.date);

    return (
        <>
            <Profile className={username === review?.username ? 'active' : ''}>
                <Box sx={{ display: 'flex' }}>
                    <Avatar sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 }, marginRight: 1 }} />
                    <Box>
                        <RatingInfo>{review?.username}</RatingInfo>
                        <StyledRating
                            name="product-rating"
                            value={review?.rating ?? 0}
                            readOnly
                            getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                            icon={<StarIcon sx={{ fontSize: 16 }} />}
                            emptyIcon={<StarBorderIcon sx={{ fontSize: 16 }} />}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                    <RatingInfo className="time"><AccessTimeIcon sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                        {`${('0' + date?.getHours()).slice(-2)}:${('0' + date?.getMinutes()).slice(-2)}`}
                    </RatingInfo>
                    <RatingInfo><CalendarMonthIcon sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                        {`${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`}
                    </RatingInfo>
                    <ReportButton className="mobile"><ReportGmailerrorred sx={{ fontSize: 20, color: 'text.secondary' }} /></ReportButton>
                </Box>
            </Profile>
            <RateContent>{review?.content}</RateContent>
            <ReportButton><ReportGmailerrorred sx={{ fontSize: 20, color: 'text.secondary' }} />&nbsp;Báo cáo</ReportButton>
        </>
    )
}

const ReviewComponent = ({ book, id, scrollIntoTab }) => {
    //#region construct
    const { username } = useAuth();
    const location = useLocation();

    //Initial value
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(-1);

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
        setPagination({ ...pagination, pageSize: newValue, currPage: 0 });
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
        reviewsContent = <><CustomProgress color="primary" /><br /><br /> </>
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = ids?.length ?
            <Box>
                {ids?.map((id, index) => {
                    const review = entities[id];

                    return (
                        <Box key={`${id}-${index}`}>
                            <Review {...{ username, review }} />
                        </Box>
                    )
                })
                }
                <AppPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Box>
            : <Box sx={{ marginBottom: 5 }}>Chưa có ai đánh giá sản phẩm, hãy trở thành người đầu tiên!</Box>
    } else if (isError) {
        reviewsContent = <Box sx={{ marginBottom: 5 }}>{error?.error}</Box>
    }
    //#endregion

    return (
        <ReviewsContainer>
            <Title>
                <Box width="100%" textAlign="left">
                    Đánh giá sản phẩm
                    <ReviewsSummary>
                        <ScoreContainer>
                            <Score>{book?.reviewsInfo?.rating ?? 0}<b>/5</b></Score>
                            <StyledRating
                                name="product-rating"
                                value={book?.reviewsInfo?.rating ?? 0}
                                readOnly
                                icon={<StarIcon fontSize="medium" />}
                                emptyIcon={<StarBorderIcon fontSize="medium" />}
                            />
                            <TotalLabel>({book?.reviewsInfo?.totalRates} đánh giá)</TotalLabel>
                        </ScoreContainer>
                        <ProgressContainer>
                            <LinearProgressWithLabel label="5 sao" value={book?.reviewsInfo?.five ?? 0 / book?.reviewsInfo?.totalRates ?? 0 * 100} />
                            <LinearProgressWithLabel label="4 sao" value={book?.reviewsInfo?.four ?? 0 / book?.reviewsInfo?.totalRates ?? 0 * 100} />
                            <LinearProgressWithLabel label="3 sao" value={book?.reviewsInfo?.three ?? 0 / book?.reviewsInfo?.totalRates ?? 0 * 100} />
                            <LinearProgressWithLabel label="2 sao" value={book?.reviewsInfo?.two ?? 0 / book?.reviewsInfo?.totalRates ?? 0 * 100} />
                            <LinearProgressWithLabel label="1 sao" value={book?.reviewsInfo?.one ?? 0 / book?.reviewsInfo?.totalRates ?? 0 * 100} />
                        </ProgressContainer>
                    </ReviewsSummary>
                </Box>
            </Title>
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
                                    {errMsg ? errMsg : "Nhận xét của bạn:"}
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
                                        <SuggestText className="hide-on-mobile">Đánh giá: </SuggestText>
                                        <StyledRating
                                            sx={{ marginLeft: 1, display: { xs: 'none', sm: 'flex' } }}
                                            name="product-rating"
                                            value={rating}
                                            onChange={(e, newValue) => { setRating(newValue) }}
                                            onChangeActive={(e, newHover) => { setHover(newHover) }}
                                            getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                                            icon={<StarIcon fontSize="inherit" />}
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />
                                        {rating !== null && <SuggestText className="label hide-on-mobile">
                                            {labels[hover !== -1 ? hover : rating]}
                                        </SuggestText>}
                                        <TextField
                                            size="small"
                                            select
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            sx={{ display: { xs: 'block', sm: 'none' } }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <StarIcon fontSize="inherit" sx={{ mr: 1, color: 'warning.light' }} />,
                                                }
                                            }}
                                        >
                                            <MenuItem value={1}>1 ({labels[1]})</MenuItem>
                                            <MenuItem value={2}>2 ({labels[2]})</MenuItem>
                                            <MenuItem value={3}>3 ({labels[3]})</MenuItem>
                                            <MenuItem value={4}>4 ({labels[4]})</MenuItem>
                                            <MenuItem value={5}>5 ({labels[5]})</MenuItem>
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
        </ReviewsContainer>
    )
}

export default ReviewComponent