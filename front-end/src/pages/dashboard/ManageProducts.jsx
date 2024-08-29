import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect, Suspense, lazy } from "react";
import { Box, Breadcrumbs, Button, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import { Add, AutoStories as AutoStoriesIcon, LocalFireDepartment, Star, Style } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import TableProducts from '../../components/dashboard/table/TableProducts'
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import CountCard from '../../components/dashboard/custom/CountCard';

const ProductFormDialog = lazy(() => import("../../components/dashboard/dialog/ProductFormDialog"));

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

const imageStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'contain',
}

const BookTitle = styled.p`
  font-size: 18px;
  margin: 0;
  font-weight: bold;
  text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const BookPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.palette.primary.main};
  margin: 10px 0 0;
`
//#endregion

const ManageProducts = () => {
  const [productCount, setProductCount] = useState(0);
  const { roles } = useAuth();
  const [seller, setSeller] = useState(!(roles?.find(role => ['ROLE_ADMIN'].includes(role.roleName))));
  const [contextProduct, setContextProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (product) => {
    setContextProduct(product);
    setOpen(true);
  }

  const handleClose = () => {
    setContextProduct(null);
    setOpen(false);
  }

  // const { loading: loadingBest, data: best } = useFetch(BOOKS_URL + "?pSize=5&sortBy=orderTime&sortDir=desc&seller=" + (seller === false ? "" : username));
  // const { loading: loadingFav, data: fav } = useFetch(BOOKS_URL + "?pSize=5&sortBy=rateAmount&sortDir=desc&seller=" + (seller === false ? "" : username));

  //Set title
  useTitle('RING! - Sản phẩm');

  return (
    <>
      <h2>Quản lý sản phẩm</h2>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link style={{ color: 'inherit' }} to={'/dashboard'}>Dashboard</Link>
          <Typography color="text.secondary">Quản lý sản phẩm</Typography>
        </Breadcrumbs>
        <Button variant="outlined" size="large" startIcon={<Add />} onClick={() => handleOpen()}>
          Thêm sản phẩm mới
        </Button>
      </Box>
      <br />
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item sm={6} md={4}>
          <CountCard
            count={productCount}
            icon={<Style />}
            title={'Sản phẩm'}
          />
        </Grid>
      </Grid>

      {/* <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        {loadingBest ? null
          :
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={{ padding: '5px 15px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center' }}><LocalFireDepartment />Top 5 sách bán chạy</h3>
              <Stack>
                {best?.content?.map((book, index) => (
                  <Paper elevation={1} key={index}
                    onClick={() => navigate(`/detail/${book.id}`)}
                    sx={{ width: '100%', display: 'flex', my: '5px', padding: 1, cursor: 'pointer' }}>
                    <LazyLoadImage src={book.image} style={imageStyle} />
                    <div>
                      <BookTitle>{book.title}</BookTitle>
                      <BookPrice>{book.price.toLocaleString()} đ</BookPrice>
                    </div>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        }

        {loadingFav ? null
          :
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={{ padding: '5px 15px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center' }}><Star />Top 5 sách được yêu thích</h3>
              <Stack>
                {fav?.content?.map((book) => (
                  <Paper elevation={1}
                    onClick={() => navigate(`/detail/${book.id}`)}
                    sx={{ width: '100%', display: 'flex', my: '5px', padding: 1, cursor: 'pointer' }}>
                    <LazyLoadImage src={book.image} style={imageStyle} />
                    <div>
                      <BookTitle>{book.title}</BookTitle>
                      <BookPrice>{book.price.toLocaleString()} đ</BookPrice>
                    </div>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        }
      </Grid> */}

      <TableProducts setProductCount={setProductCount} />
      <Suspense fallback={<></>}>
        {open && <ProductFormDialog open={open} handleClose={handleClose}/>}
      </Suspense>
    </>
  )
}

export default ManageProducts