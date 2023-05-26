import { useState, useEffect } from "react";

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import TableReviews from "../../components/dashboard/TableReviews";

import TryIcon from '@mui/icons-material/Receipt';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom"


//#region preStyled
const CountContainer = muiStyled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 15px'
}));

const CountInfo = styled.div`
  text-align: right;
`

const countIconStyle = {
  color: '#63e399', 
  backgroundColor: '#ebebeb', 
  borderRadius: '50%', 
  padding: '8px', 
  fontSize: '60px'
}
//#endregion

const ManageReviews = () => {
  const [reviewCount, setReviewCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `RING! - Đánh giá`;
  }, [])

  return (
    <>
      <h2>Quản lý đánh giá</h2>
      <h3 style={{color: 'darkgray', cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>Dashboard / Quản lý đánh giá</h3>
      <Grid container spacing={3} sx={{marginBottom: '20px'}}>
        <Grid item sm={6} md={3}>
          <CountContainer elevation={3} >
            <TryIcon sx={countIconStyle}/>
            <CountInfo><h2 style={{margin: 0}}>{reviewCount}</h2><span>Đánh giá</span></CountInfo>
          </CountContainer>
        </Grid>
      </Grid>
      <TableReviews setReviewCount={setReviewCount}/>
    </>
  )
}

export default ManageReviews