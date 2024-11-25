
import { useState } from "react";
import { Box, Breadcrumbs, Grid2 as Grid, Typography } from '@mui/material';
import { Link } from 'react-router'
import { Star } from "@mui/icons-material";
import TableReviews from "../../components/dashboard/table/TableReviews";
import useTitle from '../../hooks/useTitle';
import CountCard from "../../components/dashboard/custom/CountCard";

const ManageReviews = () => {
  const [reviewCount, setReviewCount] = useState(0);

  //Set title
  useTitle('RING! - Đánh giá');

  return (
    <>
      <h2>Quản lý đánh giá</h2>
      <Box display="flex" justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý đánh giá</Typography>
        </Breadcrumbs>
      </Box>
      <br />
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={4}>
          <CountCard
            count={reviewCount}
            icon={<Star />}
            title={'Đánh giá'}
          />
        </Grid>
      </Grid>
      <TableReviews setReviewCount={setReviewCount} />
    </>
  )
}

export default ManageReviews