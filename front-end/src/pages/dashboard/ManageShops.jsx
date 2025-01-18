import { useState, Suspense, lazy } from "react";
import { Box, Button, Grid2 as Grid } from '@mui/material';
import { Add, AutoStories, LocalFireDepartment, Storefront } from '@mui/icons-material';
import { NavLink } from 'react-router';
import { HeaderContainer } from '../../components/dashboard/custom/ShareComponents';
import { booksApiSlice, useGetBookAnalyticsQuery, useGetBooksQuery } from "../../features/books/booksApiSlice";
import TableProducts from '../../components/dashboard/table/TableProducts'
import InfoCard from '../../components/dashboard/custom/InfoCard';
import CustomDashboardBreadcrumbs from '../../components/dashboard/custom/CustomDashboardBreadcrumbs';
import ProductsShowcase from "../../components/dashboard/product/ProductsShowcase";
import useTitle from "../../hooks/useTitle"
import useAuth from "../../hooks/useAuth";
import TableShops from "../../components/dashboard/table/TableShops";

const ProductFormDialog = lazy(() => import("../../components/dashboard/dialog/ProductFormDialog"));
const PendingModal = lazy(() => import("../../components/layout/PendingModal"));

const ManageShops = () => {
  const { shop } = useAuth();
  const [contextProduct, setContextProduct] = useState(null);
  const [open, setOpen] = useState(undefined);
  const [pending, setPending] = useState(false);
  const { data: shopAnalytics } = useGetShopAnalyticsQuery();
  const [getBook, { isLoading }] = booksApiSlice.useLazyGetBookQuery();

  // const { data: fav, isLoading: loadFav, isSuccess: doneFav, isError: errorFav } = useGetBooksQuery({
  //   size: 6,
  //   sortBy: 'rating',
  //   sortDir: 'desc',
  //   amount: 0,
  //   shopId: shop ?? ''
  // });

  //Set title
  useTitle('Sản phẩm');

  const handleOpen = () => {
    setContextProduct(null);
    setOpen(true);
  }

  const handleOpenEdit = (productId) => {
    getBook(productId)
      .unwrap()
      .then((book) => {
        setContextProduct(book);
        setOpen(true);
      })
      .catch((rejected) => console.error(rejected));
  }

  const handleClose = () => { setOpen(false); }

  return (
    <>
      {(isLoading || pending) &&
        <Suspense fallBack={null}>
          <PendingModal open={(isLoading || pending)} message="Đang gửi yêu cầu..." />
        </Suspense>
      }
      <HeaderContainer>
        <div>
          <h2>Quản lý cửa hàng</h2>
          <CustomDashboardBreadcrumbs separator="." maxItems={4} aria-label="breadcrumb">
            <NavLink to={'/dashboard/shop'}>Quản lý cửa hàng</NavLink>
          </CustomDashboardBreadcrumbs>
        </div>
        <Button variant="outlined" startIcon={<Add />} onClick={handleOpen}>
          Thêm
        </Button>
      </HeaderContainer>
      <Box mb={3}>
        <InfoCard
          icon={<Storefront color="info" />}
          info={shopAnalytics}
          color="info"
        />
      </Box>
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        {/* {loadingFav ? null
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
        } */}
      </Grid>
      <TableShops {...{ handleOpenEdit, pending, setPending }} />
      <Suspense fallback={null}>
        {open !== undefined && <ProductFormDialog {...{ open, handleClose, shop, product: contextProduct, pending, setPending }} />}
      </Suspense>
    </>
  )
}

export default ManageShops