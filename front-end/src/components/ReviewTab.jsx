import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import AppPagination from '../components/AppPagination';

import { AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon, Star as StarIcon, StarBorder as StarBorderIcon} from '@mui/icons-material';
import { Avatar, Rating, Box, Grid, TextareaAutosize} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useFetch from '../hooks/useFetch'
import useAuth from "../hooks/useAuth";

//#region styled
const RatingTab = styled.div``

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

const RateButton = styled.button`
    border-radius: 0;
    padding: 10px 20px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #63e399;
    color: white;
    font-size: 16px;
    justify-content: center;
    font-weight: bold;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: gray;
    };

    &:focus {
        border: none;
        outline: none;
    }
`

const StyledRating = muiStyled(Rating)({
    color: '#63e399',
    fontSize: 18,
    '& .MuiRating-iconFilled': {
        color: '#63e399',
    },
    '& .MuiRating-iconHover': {
        color: '#00ff6a',
    },
});

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'white',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 0,
        backgroundColor: '#63e399',
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

const REVIEW_URL = `/api/reviews/`

const Review = ({review, user}) => {
    const date = new Date(review.date)
  
    return (
      <div>
        <Profiler style={{borderBottom: '1px solid', borderColor: user?.userName === review.userName ? '#63e399' : 'white'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
              <RatingInfo><Avatar sx={{width: '20px', height: '20px', marginRight: '5px'}}>A</Avatar>{review.userName}</RatingInfo>
              <RatingInfo><AccessTimeIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getHours() + ":" + date.getMinutes()}</RatingInfo>
              <RatingInfo><CalendarMonthIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</RatingInfo>
          </Box>
          <RatingInfo><StarIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{review.rating}</RatingInfo>
        </Profiler>
        <Box sx={{margin: '20px 0px 50px'}}>{review.content}</Box>
      </div>
    )
}

const ReviewTab = (props) => {
    //#region construct
    const {id} = props;
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [err, setErr] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0
    })
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const { loading: loadingReview, data: reviews, refetch } = useFetch(REVIEW_URL + id
        + "?pSize=" + pagination.pageSize 
        + "&pageNo=" + pagination.currPage);

    useEffect(() => {
        if (!loadingReview){
            setPagination({ ...pagination, totalPages: reviews?.totalPages});
            if (pagination?.currPage > pagination?.pageSize) handlePageChange(1);
        }
    }, [loadingReview])

    //Change page
    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page - 1});
    };

    const handleChangeContent = (event) => {
        setContent(event.target.value);
    };

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        setPagination({...pagination, pageSize: newValue});
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault(); 

        try {
            const response = await axiosPrivate.post(REVIEW_URL + id,
                JSON.stringify({
                    content: content,
                    rating: rating
                } ),
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
            console.log(err);
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
        }
    }

    //Review
    let review;
    if (loadingReview){
        review = <CustomLinearProgress/>
    } else if (reviews?.totalElements != 0){
        review = 
        <Box>
            {reviews?.content?.map((review, index) => (
                <Grid key={index}>
                    <Review review={review} user={auth}/>
                </Grid>
            ))}
            <AppPagination pagination={pagination}
            onPageChange={handlePageChange}
            onSizeChange={handleChangeSize}/>
        </Box>
    } else {
        review = <Box sx={{marginBottom: 5}}>Chưa có ai bình luận, hãy trở thành người đầu tiên!</Box>
    }
    //#endregion

  return (
    <RatingTab>
        {review}
        <Box>
            {auth.userName ? (err?.response?.data?.code === 208 ?
                <Box>
                    <Box><strong style={{fontSize: '16px'}}>{errMsg}</strong></Box>
                    <br/>
                    <RateButton onClick={() => navigate('/login')}>Xem đánh giá</RateButton>
                </Box>
                : err?.response?.data?.code === 204 ?
                <Box>
                    <Box><strong style={{fontSize: '16px'}}>{errMsg}</strong></Box>
                    <br/>
                    <RateButton onClick={() => scrollTo(0, 0)}>Mua ngay</RateButton>
                </Box>
                :
                <Box>
                    <Box><strong style={{fontSize: '16px', color: errMsg && !content ? 'red' : 'black'}}>
                        {errMsg ? errMsg : "Để lại đánh giá của bạn"}
                    </strong></Box>
                    <form onSubmit={handleSubmitReview}>
                        <TextareaAutosize
                            aria-label="comment"
                            minRows={7}
                            value={content}
                            onChange={handleChangeContent}
                            placeholder="Đánh giá của bạn ..."
                            style={{ width: '100%', 
                            margin: '30px 0px', 
                            backgroundColor: 'white', 
                            outline: 'none',
                            borderRadius: '0', 
                            resize: 'none', 
                            color: 'black', 
                            borderColor: err?.response?.data?.errors?.content && !content ? 'red' : 'black',
                            fontSize: '16px'}}
                        />
                        <RatingSelect>
                            <RateSelect>
                                <strong>Đánh giá: </strong>
                                <StyledRating
                                    sx={{marginLeft: '5px'}} 
                                    name="product-rating"
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                    getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                    icon={<StarIcon fontSize="10px"/>}
                                    emptyIcon={<StarBorderIcon fontSize="10"/>}
                                /> 
                            </RateSelect>
                            <RateButton>Gửi đánh giá</RateButton>
                        </RatingSelect>
                    </form>
                </Box>
            )
            : 
            <Box>
                <Box><strong style={{fontSize: '16px'}}>Bạn chưa đăng nhập, hãy Đăng nhập để đánh giá</strong></Box>
                <br/>
                <RateButton onClick={() => navigate('/login')}>Đăng nhập ngay</RateButton>
            </Box>
            }
        </Box>
    </RatingTab>
  )
}

export default ReviewTab