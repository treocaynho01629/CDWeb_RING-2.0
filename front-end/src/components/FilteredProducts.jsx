import { Grid } from "@mui/material"
import styled from "styled-components"
import Product from "./Product"
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled as muiStyled } from '@mui/system';

const Container = styled.div`
    padding: 20px 0px;
`

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

  if (loading){
    return <CustomLinearProgress/>
  }

  return (
    <Container>
      <Grid container spacing={1}>
        {booksList?.map(book=>(
            <Grid key={book.id} item xs={12} sm={6} md={4} lg={3}>
              <Product book={book}/>
            </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default FilteredProducts