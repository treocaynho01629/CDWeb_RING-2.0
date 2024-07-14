import { styled as muiStyled } from '@mui/system';
import { Box, Grid } from "@mui/material"
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
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

const FilteredProducts = ({ loading, booksList, error, totalPages = 16 }) => {

  return (
    <div style={{ padding: 0, width: '100%', position: 'relative' }}>
      <div style={{ height: '20px', width: '100%', position: 'absolute', top: 5, left: 0 }}>
        {loading && <CustomLinearProgress />}
      </div>
      <Grid container rowSpacing={1} columnSpacing={1} sx={{ width: '100%' }}>
        {(loading ? Array.from(new Array(totalPages)) : booksList)?.map((book, index) => (
          <Grid key={`${book?.id}-${index}`} item xs={6} sm={4} lg={3}>
            <Product key={`${book?.id}-${index}`} book={book} />
          </Grid>
        ))}
      </Grid>
      {!loading && !booksList?.length && !error
        &&
        <Box sx={{ marginTop: 5, marginBottom: 150 }}>Không tìm thấy sản phẩm nào!</Box>
      }
    </div>
  )
}

export default FilteredProducts