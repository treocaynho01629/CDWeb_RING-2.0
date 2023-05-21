import { styled as muiStyled } from '@mui/system';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Grid } from "@mui/material"

import Product from './Product'

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'white',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#63e399',
  },
}));

const FilteredProducts = ({loading, booksList}) => {

  return (
    <div style={{pading: '20px 0px'}}>
      <div style={{height: '20px'}}>
        {loading && (
          <CustomLinearProgress/>
        )}
      </div>

      <Grid container spacing={1}>
        {booksList?.map(book=>(
            <Grid key={book.id} item xs={12} sm={6} md={4} lg={3}>
              <Product book={book}/>
            </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default FilteredProducts