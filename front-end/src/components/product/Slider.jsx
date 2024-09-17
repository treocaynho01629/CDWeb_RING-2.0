import styled from "styled-components"
import { Grid2 as Grid, Button, Skeleton } from '@mui/material';
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useGetRandomBooksQuery } from "../../features/books/booksApiSlice";
import Carousel from "react-multi-carousel";
import useCart from "../../hooks/useCart";
import "react-multi-carousel/lib/styles.css";

//#region styled
const ImgContainer = styled.div`
    height: 430px;
    width: 105%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InfoWrapper = styled.div`
    position: relative;
    bottom: auto;
    width: 100%;

    ${props => props.theme.breakpoints.down("md")} {
        position: absolute;
        bottom: 0;
        background-image: linear-gradient(
            to right, 
            ${props => props.theme.palette.background.default}, 
            transparent, 
            ${props => props.theme.palette.background.default});
    }
`

const InfoContainer = styled.div`
    padding: 40px 50px;
    align-items: center;
    justify-content: center;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 40px 20px;
    }
`

const Title = styled.h2`
    min-height: 74px;
    font-size: 30px;
    margin: 25px 0px;
    min-width: auto;
    line-height: normal;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("md")} {
        margin: 0;
        text-shadow: 2px 2px ${props => props.theme.palette.background.default};
    }
`

const Description = styled.p`
    min-height: 72px;
    margin: 30px 0px;
    font-size: 18px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("md")} {
        text-shadow: 2px 2px ${props => props.theme.palette.background.default};
    }
`

const CustomArrow = styled.button`
  border-radius: 0;
  background-color: transparent;
  color: inherit;
  border: none;
  outline: none;
  height: 55px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  opacity: .8;
  transition: all .25s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background-color: ${props => props.theme.palette.primary.main};
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

const SlideItemContainer = styled.div`
    position: relative;
    min-height: 450px;
    max-height: 800px;
`

const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    object-fit: contain;
`
//#endregion

const responsive = {
    default: {
        breakpoint: {
            max: 3000,
            min: 900
        },
        items: 1
    },
    mobile: {
        breakpoint: {
            max: 900,
            min: 0
        },
        items: 1
    }
};

const CustomLeftArrow = ({ onClick }) => (
    <CustomArrow className="custom-left-arrow" onClick={() => onClick()}><KeyboardArrowLeft /></CustomArrow>
);

const CustomRightArrow = ({ onClick }) => (
    <CustomArrow className="custom-right-arrow" onClick={() => onClick()}><KeyboardArrowRight /></CustomArrow>
);

function Item({ book, index }) {
    const { addProduct } = useCart();

    const handleAddToCart = (book) => {addProduct(book, 1)};

    return (
        <SlideItemContainer>
            <Grid container size="grow" sx={{ alignItems: 'center', position: 'relative' }}>
                <Grid size={{ xs: 12, md: 5 }} mb={{ xs: '100px', md: 0 }}>
                    {book
                        ?
                        <Link to={`/product/${book.id}`}>
                            <ImgContainer>
                                <StyledLazyImage
                                    src={book.image}
                                    srcSet={`${book.image}?size=medium 350w, ${book.image} 600w`}
                                    alt={`${book.title} Big product item`}
                                    sizes='400px'
                                    height={400}
                                    width={'100%'}
                                    visibleByDefault={index == 0}
                                    placeholder={
                                        <Skeleton
                                            variant="rectangular"
                                            height={400}
                                            sx={{ width: { xs: '80%', md: '100%' } }}
                                            animation={false}
                                        />
                                    }
                                />
                            </ImgContainer>
                        </Link>
                        :
                        <ImgContainer>
                            <Skeleton
                                variant="rectangular"
                                height={400}
                                sx={{ width: { xs: '80%', md: '100%' } }}
                            />
                        </ImgContainer>
                    }
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                    <InfoWrapper>
                        {book
                            ?
                            <InfoContainer>
                                <Link to={`/product/${book.id}`} style={{ color: 'inherit' }}>
                                    <Title>{book.title}</Title>
                                    <Description>{book.description}</Description>
                                </Link>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => handleAddToCart(book)}
                                >
                                    Mua ngay
                                </Button>
                            </InfoContainer>
                            :
                            <InfoContainer>
                                <Skeleton variant="text" sx={{ fontSize: '30px' }} />
                                <br />
                                <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '18px' }} width={'50%'} />
                                <br />
                                <Button
                                    disabled
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Mua ngay
                                </Button>
                            </InfoContainer>
                        }
                    </InfoWrapper>
                </Grid>
            </Grid>
        </SlideItemContainer>
    )
}

const Slider = () => {
    const { data, isLoading, isSuccess, isError } = useGetRandomBooksQuery({ amount: 5 });

    let productsCarousel;

    if (isLoading || isError) {
        productsCarousel = <Item />
    } else if (isSuccess) {
        const { ids, entities } = data;

        productsCarousel =
            ids?.length
                ?
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={15000}
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                    removeArrowOnDeviceType={["mobile"]}
                    pauseOnHover
                    keyBoardControl
                    minimumTouchDrag={80}
                >

                    {ids?.map((id, index) => {
                        const book = entities[id];

                        return (
                            <Item key={`${id}-${index}`} book={book} index={index} />
                        )
                    })}
                </Carousel>
                :
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={15000}
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                    removeArrowOnDeviceType={["mobile"]}
                    pauseOnHover
                    keyBoardControl
                    minimumTouchDrag={80}
                >
                    <Item />
                </Carousel>
    }

    return (
        <>
            {productsCarousel}
        </>
    )
}

export default Slider