import styled from 'styled-components'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

//#region styled
const ImgContainer = styled.div`
    text-align: center;
    border: .5px solid ${props => props.theme.palette.divider};
    border-bottom: none;
    
    ${props => props.theme.breakpoints.up("md")} {
        width: 100%;
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
        border-bottom: .5px solid ${props => props.theme.palette.divider};
    }
`

const ImageNumber = styled.p`
    font-size: 16px;
    font-weight: bold;
    padding: 2px 10px;
    position: absolute;
    color: ${props => props.theme.palette.primary.contrastText};
    background-color: ${props => props.theme.palette.primary.main};
    border-radius: 50px;
    top: 2%;
    left: 5%;
    opacity: .9;
    z-index: 5;
    pointer-events: none;
    white-space: nowrap;

    ${props => props.theme.breakpoints.down("md")} {
        bottom: 20%;
        right: 5%;
        top: auto;
        left: auto;
    }
`

const MoreImageContainer = styled.div`
    padding: 10px;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 5px;
    }
`

const SmallImageSlide = styled.div`
    display: flex;
    border: .5px solid ${props => props.theme.palette.divider};
    opacity: .5;
    margin-right: 4px;
    cursor: pointer;
    transition: all .25s ease;

    &.active {
        border: 1px solid ${props => props.theme.palette.primary.main};
        opacity: 1;
    }

    &:hover {
        border: 1px solid ${props => props.theme.palette.primary.light};
        opacity: 1;
    }
`

const CustomArrow = styled.button`
    border-radius: 0;
    background-color: #0000005e;
    border: none;
    outline: none;
    height: 35px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    opacity: .5;
    cursor: pointer;
    transition: all .25s ease;

    &:hover {
        opacity: .7;
        background-color: ${props => props.theme.palette.primary.main};
    }

    svg {font-size: 2em;}
    &.custom-left-arrow {left: 0;}
    &.custom-right-arrow {right: 0; }
`

const ImageSlide = styled.div`
    padding: 15px 10px;
    position: relative;
    width: 100%;
    max-height: 450px;
    aspect-ratio: 1/1;
    display: grid;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 5px 0 0 0;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    object-fit: contain;
    width: 100%;
    max-height: 450px;

    &.hidden {display: none;}
`

const StyledSmallLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    object-fit: contain;
    width: 100%;
    aspect-ratio: 1/1;
`

const StyledSkeleton = styled(Skeleton)`
    width: 100%;
    height: 100%;
    max-height: 450px;
    aspect-ratio: 1/1;
`

const StyledSmallSkeleton = styled(Skeleton)`
    display: inline-block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
`
//#endregion

const responsive = {
    default: {
        breakpoint: {
            max: 3000,
            min: 900
        },
        items: 1,
    },
    mobile: {
        breakpoint: {
            max: 900,
            min: 0
        },
        items: 1,
    }
};

const responsiveMini = {
    default: {
        breakpoint: {
            max: 3000,
            min: 900
        },
        items: 5,
        partialVisibilityGutter: 5
    },
    mobile: {
        breakpoint: {
            max: 900,
            min: 0
        },
        items: 6,
        partialVisibilityGutter: 5
    }
};

//Custom stuff
const CustomLeftArrow = ({ carouselState, onClick, setSlideIndex }) => (
    <CustomArrow
        className="custom-left-arrow"
        onClick={() => {
            onClick();
            setSlideIndex(carouselState?.currentSlide);
        }}
    >
        <KeyboardArrowLeft />
    </CustomArrow>
);

const CustomRightArrow = ({ carouselState, onClick, setSlideIndex }) => (
    <CustomArrow
        className="custom-right-arrow"
        onClick={() => {
            onClick();
            setSlideIndex(carouselState?.currentSlide + 2);
        }}
    >
        <KeyboardArrowRight />
    </CustomArrow>
);

const CustomButtonGroup = ({ book, images, setSlideIndex, goToSlide, carouselState }) => {
    const { currentSlide } = carouselState;

    return (
        <MoreImageContainer>
            <Carousel
                responsive={responsiveMini}
                autoPlay={false}
                customLeftArrow={<CustomLeftArrow setSlideIndex={setSlideIndex} />}
                customRightArrow={<CustomRightArrow setSlideIndex={setSlideIndex} />}
                removeArrowOnDeviceType={["mobile"]}
                minimumTouchDrag={80}
                partialVisible
                draggable
            >
                {book ? images.map((image, index) => (
                    <SmallImageSlide key={index}
                        className={`${index === currentSlide ? 'active' : ''}`}
                        onClick={() => {
                            goToSlide(index);
                            setSlideIndex(index + 1);
                        }}>
                        <StyledSmallLazyImage
                            src={`${image}?size=small`}
                            placeholder={<StyledSmallSkeleton variant="rectangular" />}
                        />
                    </SmallImageSlide>
                ))
                    : Array.from(new Array(4)).map((item, index) => (
                        <SmallImageSlide key={index}>
                            <StyledSmallSkeleton variant="rectangular" />
                        </SmallImageSlide>
                    ))
                }
            </Carousel>
        </MoreImageContainer>
    );
};


const ProductImages = ({ book }) => {
    const [slideIndex, setSlideIndex] = useState(1);
    const images = [].concat(book?.previewImages, book?.image);

    return (
        <ImgContainer>
            <ImageNumber>{slideIndex}/{images.length}</ImageNumber>
            {book ?
                <Carousel
                    renderButtonGroupOutside
                    responsive={responsive}
                    autoPlay={true}
                    arrows={false}
                    autoPlaySpeed={10000}
                    keyBoardControl
                    draggable
                    customButtonGroup={<CustomButtonGroup {...{ setSlideIndex, images, book }} />}
                    minimumTouchDrag={80}
                >
                    {images.map((image, index) => (
                        <ImageSlide key={index}>
                            <StyledLazyImage
                                src={image}
                                srcSet={`${image}?size=medium 350w, ${image} 600w`}
                                alt={`${book?.title} preview image #${index}`}
                                sizes="400px"
                                visibleByDefault={index == 0}
                                placeholder={<StyledSmallSkeleton variant="rectangular" />}
                            />
                        </ImageSlide>
                    ))}
                </Carousel>
                : <ImageSlide>
                    <StyledSkeleton variant="rectangular" />
                </ImageSlide>
            }
        </ImgContainer >
    )
}

export default ProductImages