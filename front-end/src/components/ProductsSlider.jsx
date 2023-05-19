import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

//#region styled
import ProductSimple from "./ProductSimple"

const Container = styled.div`
    position: relative;
    height: 384px;
    margin-bottom: 10px;
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
//#endregion

const ProductsSlider = ({loading, booksList}) => {

  let responsive = 
  {768:{
      items:3
  },
  992:{
      items:4
  },
  1200:{
      items:5
  }}

  if (loading){
    return (
      <Container>
        <CustomLinearProgress/>
      </Container>
    )
  }

  return (
    <Container>
      <OwlCarousel className='owl-theme' loop lazyLoad dots={false} margin={10} responsive={responsive}>
      {booksList?.map((book, index) => (
        <div className='item' key={index} style={{display: 'flex'}}>
          <ProductSimple book={book}/>
        </div>
      ))}
      </OwlCarousel>
    </Container>
  )
}

export default ProductsSlider