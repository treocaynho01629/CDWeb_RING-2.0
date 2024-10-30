import { memo } from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import { trackWindowScroll } from "react-lazy-load-image-component";
import Product from '../Product';
import CustomProgress from '../../custom/CustomProgress';

const FilteredProducts = memo(({ data, error, loading, scrollPosition }) => {
  let productsContent;

  if (data) {
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
      <Box sx={{ marginTop: 2, width: '100%', textAlign: 'center' }}>Không tìm thấy sản phẩm nào!</Box>
  } else if (error) {
    productsContent = (
      <Box sx={{ marginTop: 2, width: '100%', textAlign: 'center' }}>{error?.error ?? 'Đã xảy ra lỗi!'}</Box>
    )
  }

  return (
    <Box sx={{ padding: 0, width: '100%', position: 'relative', minHeight: '90dvh' }}>
      {loading && <CustomProgress color={`${error ? 'error' : 'primary'}`} />}
      <Grid container spacing={.5} size="grow">
        {productsContent}
      </Grid>
    </Box>
  )
})

export default trackWindowScroll(FilteredProducts)