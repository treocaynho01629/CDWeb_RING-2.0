import styled from "styled-components";
import CustomProgress from '../custom/CustomProgress';
import Carousel from "react-multi-carousel";
import ProductSimple from "./ProductSimple"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { trackWindowScroll } from "react-lazy-load-image-component";
import "react-multi-carousel/lib/styles.css";

//#region styled
const Container = styled.div`
    position: relative;
    max-height: 380px;
    margin-bottom: 10px;

    ${props => props.theme.breakpoints.down("sm_md")} {
      padding: 5px 5px;
    }
`

const ProductContainer = styled.div`
    display: flex;
    height: 100%;
`

const CustomArrow = styled.button`
  border-radius: 0;
  background-color: #0000005e;
  border: none;
  outline: none;
  height: 45px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  opacity: .5;
  cursor: pointer;
  transition: all .25s ease;
  z-index: 2;

  &:hover {
    opacity: .7;
    background-color: ${props => props.theme.palette.primary.main};
  }

  svg {font-size: 2em;}
  &.custom-left-arrow {left: 0;}
  &.custom-right-arrow {right: 0; }
`
//#endregion

const responsive = {
  widescreen: {
    breakpoint: { max: 3000, min: 1200 },
    items: 5,
    slidesToSlide: 5
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 4,
    slidesToSlide: 4
  },
  tablet: {
    breakpoint: { max: 992, min: 600 },
    items: 3,
    slidesToSlide: 3
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
    slidesToSlide: 2
  }
};

const CustomLeftArrow = ({ onClick }) => (
  <CustomArrow className="custom-left-arrow" onClick={() => onClick()}><KeyboardArrowLeft /></CustomArrow>
);

const CustomRightArrow = ({ onClick }) => (
  <CustomArrow className="custom-right-arrow" onClick={() => onClick()}><KeyboardArrowRight /></CustomArrow>
);

const tempItems = [
  <ProductSimple key={'temp1'} />,
  <ProductSimple key={'temp2'} />,
  <ProductSimple key={'temp3'} />,
  <ProductSimple key={'temp4'} />,
  <ProductSimple key={'temp5'} />
];

const ProductsSlider = ({ data, isError, isLoading, isFetching, isSuccess, isUninitialized = false, scrollPosition }) => {
  let productsCarousel;
  const loading = (isLoading || isFetching || isError || isUninitialized);

  if (loading) {
    productsCarousel = tempItems;
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsCarousel = ids?.length
      ?
      [
        ids?.map((id, index) => {
          const book = entities[id];

          return (
            <ProductContainer key={`${id}-${index}`}>
              <ProductSimple {...{ book, scrollPosition }} />
            </ProductContainer>
          )
        })
      ] : <p>TEMP</p>
  } else {
    productsCarousel = tempItems;
  }

  return (
    <Container>
      {(loading) && <CustomProgress color={`${isError || isUninitialized ? 'error' : 'primary'}`} />}
      <Carousel
        responsive={responsive}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        removeArrowOnDeviceType={["mobile"]}
        pauseOnHover
        keyBoardControl
        minimumTouchDrag={80}
      >
        {productsCarousel}
      </Carousel>
    </Container>
  )
}

export default trackWindowScroll(ProductsSlider)