import React from "react"
import { Avatar, Box } from "@mui/material"
import styled from "styled-components"

import StarIcon from '@mui/icons-material/Star'

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Container = styled.div`
`

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    text-transform: uppercase;
`

const Products = ({review}) => {

  const date = new Date(review.date)

  return (
    <Container>
      <Profiler>
        <Box sx={{display: 'flex'}}>
            <RatingInfo><Avatar sx={{width: '20px', height: '20px', marginRight: '5px'}}>A</Avatar>{review.userName}</RatingInfo>
            <RatingInfo><AccessTimeIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getHours() + ":" + date.getMinutes()}</RatingInfo>
            <RatingInfo><CalendarMonthIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</RatingInfo>
        </Box>
        <RatingInfo><StarIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{review.rating}</RatingInfo>
      </Profiler>
      <Box sx={{margin: '20px 0px 50px'}}>{review.content}</Box>
    </Container>
  )
}

export default Products