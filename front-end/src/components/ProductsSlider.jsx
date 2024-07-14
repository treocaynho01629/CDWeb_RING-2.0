import styled from "styled-components"
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

//#region styled
import ProductSimple from "./ProductSimple"

const Container = styled.div`
    position: relative;
    height: 384px;
    margin-bottom: 10px;
    padding: 5px 5px;

    @media (min-width: 768px) {
        padding: auto;
    }
`
//#endregion

const responsive =
{
  0: {
    items: 2
  },
  600: {
    items: 3
  },
  768: {
    items: 3
  },
  992: {
    items: 4
  },
  1200: {
    items: 5
  }
}

const ProductsSlider = ({ loading, booksList }) => {

  let content =
    (loading || !booksList?.length ? Array.from(new Array(5)) : booksList).map((book, index) => (
      <div className="item" key={`${book?.id}-${index}`} style={{ display: 'flex' }}>
        <ProductSimple book={book} />
      </div>
    ))

  return (
    <Container>
      <OwlCarousel className="owl-theme" autoPlay="true" rewind lazyLoad dots={false} margin={10} responsive={responsive}>
        {content}
      </OwlCarousel>
    </Container>
  )
}

export default ProductsSlider