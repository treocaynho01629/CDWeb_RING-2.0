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
    <div style={{padding: 0, width: '100%'}}>
      <div style={{height: '20px', width: '100%'}}>
        {loading && (
          <CustomLinearProgress/>
        )}
      </div>

      <Grid container rowSpacing={2} columnSpacing={3} sx={{width: '100%'}}>
        {booksList?.map(book=>(
            <Grid key={book.id} item xs={6} sm={4} lg={3}>
              <Product book={book}/>
            </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default FilteredProducts