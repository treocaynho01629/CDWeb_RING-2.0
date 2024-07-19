import { Grid } from "@mui/material"
import Product from './Product'
import CustomProgress from "./custom/CustomProgress";

const Products = ({ data, isError, isLoading, isSuccess }) => {
  let productsContent;

  if (isLoading || isError) {
    productsContent = (
      Array.from(new Array(15)).map((index) => (
        <Grid key={index} item xs={6} sm={4} md={3} lg={2.4}>
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
          <Grid key={`${id}-${index}`} item xs={6} sm={4} md={3} lg={2.4}>
            <Product book={book} />
          </Grid>
        )
      })
      : Array.from(new Array(15)).map((index) => (
        <Grid key={index} item xs={6} sm={4} md={3} lg={2.4}>
          <Product />
        </Grid>
      ))
  }

  return (
    <div style={{ padding: '20px 0px' }}>
      {(isLoading || isError) && <CustomProgress color={`${isError ? 'error' : 'secondary'}`} />}
      <Grid container spacing={1}>
        {productsContent}
      </Grid>
    </div>
  )
}

export default Products