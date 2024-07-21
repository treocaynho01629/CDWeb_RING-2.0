import styled from "styled-components"
import { Grid, Skeleton } from '@mui/material';
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useGetRandomBooksQuery } from "../../features/books/booksApiSlice";
import Carousel from "react-multi-carousel";
import CustomButton from "../custom/CustomButton";
import useCart from "../../hooks/useCart";

//#region styled
const ImgContainer = styled.div`
    height: 430px;
    width: 105%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InfoContainer = styled.div`
    padding: 40px 50px;
    align-items: center;
    justify-content: center;
`

const Title = styled.h2`
    min-height: 74px;
    font-size: 30px;
    margin: 0;
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

    @media (min-width: 900px) {
        margin: 25px 0px;
        min-width: auto;
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

    @media (min-width: 900px) {
        min-width: auto;
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
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1024
        },
        items: 1
    },
    mobile: {
        breakpoint: {
            max: 464,
            min: 0
        },
        items: 1
    },
    tablet: {
        breakpoint: {
            max: 1024,
            min: 464
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

function Item({ book }) {
    const { addProduct } = useCart();

    const handleAddToCart = (book) => {
        addProduct({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1,
        })
    };

    return (
        <div style={{ minHeight: '450px', maxHeight: '800px' }}>
            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs={12} md={5}
                    sx={{
                        marginBottom: { xs: '100px', md: 0 }
                    }}
                >
                    {book
                        ?
                        <Link to={`/product/${book.id}`}>
                            <ImgContainer>
                                <LazyLoadImage src={book.image}
                                    height={400}
                                    width={'100%'}
                                    style={{
                                        objectFit: 'contain',
                                        aspectRatio: '1/1'
                                    }}
                                />
                            </ImgContainer>
                        </Link>
                        :
                        <ImgContainer>
                            <Skeleton variant="rectangular" width={'100%'} height={400} sx={{ aspectRatio: '1/1' }} />
                        </ImgContainer>
                    }
                </Grid>
                <Grid item xs={12} md={7}
                    sx={{
                        position: { xs: 'absolute', md: 'relative' }
                        , bottom: { xs: 0, md: 'auto' }
                        , background: { xs: '#ffffff89', md: 'transparent'}
                        , width: '100%'
                    }}
                >
                    {book
                        ?
                        <InfoContainer>
                            <Link to={`/product/${book.id}`} style={{ color: 'inherit' }}>
                                <Title>{book.title}</Title>
                                <Description>{book.description}</Description>
                            </Link>
                            <CustomButton
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={() => handleAddToCart(book)}
                            >
                                Mua ngay
                            </CustomButton>
                        </InfoContainer>
                        :
                        <InfoContainer>
                            <Skeleton variant="text" sx={{ fontSize: '30px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '30px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="rectangular" width={109} height={39} />
                        </InfoContainer>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

const Slider = () => {
    const { data, isLoading, isSuccess, isError } = useGetRandomBooksQuery({ amount: 5 });

    let productsCarousel;

    if (isLoading || isError) {
        productsCarousel = <Item />
    } else if (isSuccess) {
        const { ids, entities } = data;

        productsCarousel = ids?.length
            ?
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={15000}
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
                        <Item key={`${id}-${index}`} book={book} />
                    )
                })}
            </Carousel>
            :
            <Item />
    }

    return (
        <>
            {productsCarousel}
        </>
    )
}

export default Slider