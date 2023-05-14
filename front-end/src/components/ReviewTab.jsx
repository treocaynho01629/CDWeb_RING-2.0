import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import AppPagination from '../components/AppPagination';
import Review from '../components/Review';

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import useFetch from '../hooks/useFetch'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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
    padding: 10px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: #63e399;
    color: white;
    font-size: 14px;
    justify-content: center;
    font-weight: bold;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: gray;
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

const REVIEW_URL = `/api/reviews/`

const ReviewTab = (props) => {
    const {id, rateAmount} = props;
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewList, setReviewList] = useState([]);
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 5,
        totalPages: 0
    })
    const axiosPrivate = useAxiosPrivate();

    const { loading: loadingReview, data: reviews, refetch } = useFetch(REVIEW_URL + id
        + "?pSize=" + pagination.pageSize 
        + "&pageNo=" + pagination.currPage);

    useEffect(() => {
        if (!loadingReview){
            loadReview(); 
        }
    }, [pagination.currPage, pagination.pageSize, loadingReview])

    const loadReview = async ()=>{
        setPagination({ ...pagination, totalPages: reviews?.totalPages});
        setReviewList(reviews?.content);
    }

    //Change page
    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page - 1});
    };

    const handleChangeContent = (event) => {
        setContent(event.target.value);
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
            setContent('');
            setRating(5);
        } catch (err) {
            console.log(err);
            if (!err?.response) {
            } else if (err.response?.status === 404) {
            } else {
            }
        }
    }

    //Review
    let review;
    if (loadingReview){
        review = <p>loading</p>
    } else if (rateAmount != 0){
        review = 
        <Box>
            {reviewList?.map((review, index) => (
                <Grid key={index}>
                    <Review review={review}/>
                </Grid>
            ))}
            <AppPagination pagination={pagination}
            onPageChange={handlePageChange}/>
        </Box>
    } else {
        review = <Box sx={{marginBottom: 5}}>Chưa có ai bình luận, hãy trở thành người đầu tiên!</Box>
    }

  return (
    <RatingTab>
        {review}
        <Box>
            <Box>
                <strong>Để lại đánh giá của bạn</strong>
            </Box>
            <form onSubmit={handleSubmitReview}>
            <TextareaAutosize
                aria-label="comment"
                minRows={7}
                value={content}
                onChange={handleChangeContent}
                placeholder="Đánh giá của bạn ..."
                style={{ width: '100%', margin: '30px 0px', backgroundColor: 'white', outline: 'none',
                borderRadius: '0', resize: 'none', color: 'black', fontSize: '16px'}}
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
    </RatingTab>
  )
}

export default ReviewTab