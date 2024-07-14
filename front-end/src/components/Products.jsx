import { Grid } from "@mui/material"
import Product from './Product'

const Products = ({ loading, booksList }) => {

  return (
    <div style={{ padding: '20px 0px' }}>
      <Grid container spacing={1}>
        {(loading || !booksList?.length ? Array.from(new Array(15)) : booksList)?.map((book, index) => (
          <Grid key={`${book?.id}-${index}`} item xs={6} sm={4} md={3} lg={2.4}>
            <Product key={`${book?.id}-${index}`} book={book} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Products