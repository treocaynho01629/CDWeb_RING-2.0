import { Box, Grid } from "@mui/material";
import Product from './Product';
import CustomProgress from '../components/custom/CustomProgress';

const FilteredProducts = ({ data, isError, error, isLoading, isSuccess, pageSize = 16 }) => {

  let productsContent;

  if (isLoading) {
    productsContent = (
      Array.from(new Array(pageSize)).map((index) => (
        <Grid key={index} item xs={6} sm={4} lg={3}>
          <Product/>
        </Grid>
      ))
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsContent = ids?.length
      ? ids?.map((id, index) => {
        const book = entities[id];

        return (
          <Grid key={`${id}-${index}`} item xs={6} sm={4} lg={3}>
            <Product book={book} />
          </Grid>
        )
      })
      :
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>Không tìm thấy sản phẩm nào!</Box>
  } else if (isError) {
    productsContent = (
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>{error}</Box>
    )
  }

  return (
    <div style={{ padding: 0, width: '100%', position: 'relative' }}>
      {isLoading && <CustomProgress color={"secondary"}/>}
      <Grid container rowSpacing={1} columnSpacing={1} sx={{ width: '100%' }}>
        {productsContent}
      </Grid>
    </div>
  )
}

export default FilteredProducts