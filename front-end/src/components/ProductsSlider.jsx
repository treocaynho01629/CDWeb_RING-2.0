import styled from "styled-components";
import CustomProgress from '../components/custom/CustomProgress';
import OwlCarousel from 'react-owl-carousel';
import ProductSimple from "./ProductSimple"
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

//#region styled
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

const ProductsSlider = ({ data, isError, isLoading, isSuccess }) => {

  let productsContent;

  if (isLoading || isError) {
    productsContent = (
      Array.from(new Array(5)).map((index) => (
        <div className="item" key={index} style={{ display: 'flex' }}>
          <ProductSimple />
        </div>
      ))
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsContent = ids?.length
      ? ids?.map((id, index) => {
        const book = entities[id];

        return (
          <div className="item" key={`${id}-${index}`} style={{ display: 'flex' }}>
            <ProductSimple book={book} />
          </div>
        )
      })
      :
      Array.from(new Array(5)).map((index) => (
        <div className="item" key={index} style={{ display: 'flex' }}>
          <ProductSimple />
        </div>
      ))
  }

  return (
    <Container>
      {(isLoading || isError) && <CustomProgress color={`${isError ? 'error' : 'secondary'}`}/>}
      <OwlCarousel className="owl-theme" autoPlay={true} rewind lazyLoad dots={false} margin={10} responsive={responsive}>
        {productsContent}
      </OwlCarousel>
    </Container>
  )
}

export default ProductsSlider