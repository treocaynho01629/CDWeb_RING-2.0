import styled from "styled-components"

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import Skeleton from '@mui/material/Skeleton';

import ProductSimple from "./ProductSimple"

const Container = styled.div`
    position: relative;
`

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
        <p></p>
        <OwlCarousel className='owl-theme' lazyLoad dots={false} margin={10} items={5}>
        {Array.from(new Array(5))?.map((index) => (
          <Skeleton key={index} variant="rectangular" animation="wave" width={213} height={380}/>
        ))}
        </OwlCarousel>
      </Container>
    )
  }

  return (
    <Container>
      <OwlCarousel className='owl-theme' loop lazyLoad dots={false} margin={10} responsive={responsive}>
      {booksList?.map((book, index) => (
        <div class='item' key={index} style={{display: 'flex'}}>
          <ProductSimple book={book}/>
        </div>
      ))}
      </OwlCarousel>
    </Container>
    
  )
}

export default ProductsSlider