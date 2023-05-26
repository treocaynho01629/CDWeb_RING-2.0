import { Grid } from "@mui/material"
import Product from './Product'

const Products = ({booksList}) => {

  return (
    <div style={{padding: '20px 0px'}}>
      <Grid container spacing={1}>
        {booksList.map((book)=>(
            <Grid key={book.id} item xs={12} sm={4} md={3} lg={2.4}>
              <Product key={book.id} book={book}/>
            </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Products