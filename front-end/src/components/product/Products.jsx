import Grid from "@mui/material/Grid2"
import { trackWindowScroll } from "react-lazy-load-image-component";
import Product from './Product'
import CustomProgress from "../custom/CustomProgress";

const Products = ({ data, isError, isLoading, isSuccess, scrollPosition }) => {
  let productsContent;

  if (isLoading || isError) {
    productsContent = (
      Array.from(new Array(15)).map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
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
          <Grid key={`product-${id}-${index}`} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <Product {...{ book, scrollPosition }} />
          </Grid>
        )
      })
      : Array.from(new Array(15)).map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
          <Product />
        </Grid>
      ))
  }

  return (
    <div style={{ padding: 0, width: '100%', position: 'relative' }}>
      {(isLoading || isError) && <CustomProgress color={`${isError ? 'error' : 'primary'}`} />}
      <Grid container spacing={.2} size="grow">
        {productsContent}
      </Grid>
    </div>
  )
}

export default trackWindowScroll(Products)