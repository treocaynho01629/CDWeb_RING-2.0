import { Box, Grid2 as Grid } from "@mui/material";
import { trackWindowScroll } from "react-lazy-load-image-component";
import Product from '../Product';
import CustomProgress from '../../custom/CustomProgress';

const FilteredProducts = ({ data, isError, error, isLoading, isSuccess, pageSize = 16, scrollPosition }) => {
  let productsContent;

  if (isLoading) {
    productsContent = (
      Array.from(new Array(pageSize)).map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, lg: 3 }}>
          <Product />
        </Grid>
      ))
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsContent = ids?.length
      ? ids?.map((id, index) => {
        const book = entities[id];

        return (
          <Grid key={`${id}-${index}`} size={{ xs: 6, sm: 4, lg: 3 }}>
            <Product {...{ book, scrollPosition }} />
          </Grid>
        )
      })
      :
      <Box sx={{ marginLeft: 1, marginTop: 2, marginBottom: '90dvh', width: '100%', textAlign: 'center' }}>Không tìm thấy sản phẩm nào!</Box>
  } else if (isError) {
    productsContent = (
      <Box sx={{ marginLeft: 1, marginTop: 2, marginBottom: '90dvh', width: '100%', textAlign: 'center' }}>{error?.error ?? 'Đã xảy ra lỗi!'}</Box>
    )
  }

  return (
    <Box sx={{ padding: 0, width: '100%', position: 'relative' }}>
      {isLoading && <CustomProgress color="primary" />}
      <Grid container spacing={.5} size="grow">
        {productsContent}
      </Grid>
    </Box>
  )
}

export default trackWindowScroll(FilteredProducts)