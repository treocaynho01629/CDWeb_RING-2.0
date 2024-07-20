import styled from "styled-components";
import CustomProgress from '../custom/CustomProgress';
import Carousel from "react-multi-carousel";
import ProductSimple from "./ProductSimple"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import "react-multi-carousel/lib/styles.css";

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

const CustomArrow = styled.button`
  border-radius: 0;
  background-color: #0000005e;
  border: none;
  outline: none;
  height: 55px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  opacity: .8;
  transition: all .3s ease;

  &:hover {
    opacity: 1;
    background-color: ${props => props.theme.palette.secondary.main};
  }

  svg {
    font-size: 2em;
  }

  &.custom-left-arrow {
    left: 1%;
  }

  &.custom-right-arrow {
    right: 1%;
  }
`
//#endregion

const responsive = {
  widescreen: {
    breakpoint: { max: 3000, min: 1200 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 992, min: 600 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2
  }
};

const CustomLeftArrow = ({ onClick }) => (
  <CustomArrow className="custom-left-arrow" onClick={() => onClick()}><KeyboardArrowLeft /></CustomArrow>
);

const CustomRightArrow = ({ onClick }) => (
  <CustomArrow className="custom-right-arrow" onClick={() => onClick()}><KeyboardArrowRight /></CustomArrow>
);

const ProductsSlider = ({ data, isError, isLoading, isSuccess }) => {

  let productsCarousel;

  if (isLoading || isError) {
    productsCarousel = (
      <Carousel
        responsive={responsive}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {
          Array.from(new Array(5)).map((index) => (
            <div key={index} style={{ display: 'flex' }}>
              <ProductSimple />
            </div>
          ))
        }
      </Carousel>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsCarousel = ids?.length
      ?
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={10000}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        pauseOnHover
        keyBoardControl
        minimumTouchDrag={80}
      >

        {ids?.map((id, index) => {
          const book = entities[id];

          return (
            <div key={`${id}-${index}`} style={{ display: 'flex' }}>
              <ProductSimple book={book} />
            </div>
          )
        })}
      </Carousel>
      :
      <Carousel
        responsive={responsive}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {Array.from(new Array(5)).map((index) => (
          <div key={index} style={{ display: 'flex' }}>
            <ProductSimple />
          </div>
        ))}
      </Carousel>
  }

  return (
    <Container>
      {(isLoading || isError) && <CustomProgress color={`${isError ? 'error' : 'secondary'}`} />}
      {productsCarousel}
    </Container>
  )
}

export default ProductsSlider