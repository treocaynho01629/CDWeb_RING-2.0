import styled from 'styled-components'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Carousel from 'react-multi-carousel';
import 'react-lazy-load-image-component/src/effects/blur.css';

//#region styled
const ImgContainer = styled.div`
    text-align: center;
    border: none;
    
    ${props => props.theme.breakpoints.up("sm")} {
        width: 100%;
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
        border: .5px solid ${props => props.theme.palette.action.focus};
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
    top: 5px;
    left: 10px;
    opacity: .9;
    z-index: 5;
    pointer-events: none;
    white-space: nowrap;

    ${props => props.theme.breakpoints.down("sm")} {
        bottom: 60px;
        right: 15px;
        top: auto;
        left: auto;
    }
`

const MoreImageContainer = styled.div`
    padding: 10px;
`

const SmallImageSlider = styled.div`
    display: flex;
    width: 95%;
    margin: 0px 10px;
    user-select: none;
    white-space: nowrap;
    padding: 10px;

    ${props => props.theme.breakpoints.down("sm")} {
       padding: 0;
    }
`

const SmallImageSlide = styled.div`
    display: flex;
    border: .5px solid ${props => props.theme.palette.action.focus};
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
    aspect-ratio: 1/1;
    display: grid;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 5px 0 0 0;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    object-fit: contain;
    width: 100%;

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

const ProductImages = ({ book }) => {
    const [slideIndex, setSlideIndex] = useState(1);
    const images = [].concat(book?.previewImages, book?.image);
    images.push(book?.image);
    images.push(book?.image);
    images.push(book?.image);
    images.push(book?.image);
    images.push(book?.image);
    images.push(book?.image);

    return (
        <ImgContainer>
            <ImageNumber>{slideIndex}/{images.length}</ImageNumber>
            <ImageSlide >
                {book ? images.map((image, index) => (
                    <StyledLazyImage
                        key={index}
                        className={(index + 1) === slideIndex ? 'active' : 'hidden'}
                        src={image}
                        srcSet={`${image}?size=medium 350w, ${image} 600w`}
                        alt={`${book?.title} preview image #${index}`}
                        sizes="400px"
                        visibleByDefault={index == 0}
                        placeholder={<StyledSmallSkeleton variant="rectangular" />}
                    />
                ))
                    : <StyledSkeleton variant="rectangular" />
                }
            </ImageSlide>
            <MoreImageContainer>
                <Carousel
                    responsive={responsive}
                    autoPlay={false}
                    customLeftArrow={<CustomLeftArrow setSlideIndex={setSlideIndex} />}
                    customRightArrow={<CustomRightArrow setSlideIndex={setSlideIndex} />}
                    removeArrowOnDeviceType={["mobile"]}
                    keyBoardControl
                    minimumTouchDrag={80}
                    partialVisible
                    draggable
                >
                    {book ? images.map((image, index) => (
                        <SmallImageSlide key={index}
                            className={`${index + 1 === slideIndex ? 'active' : ''}`}
                            onClick={() => setSlideIndex(index + 1)}>
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
        </ImgContainer>
    )
}

export default ProductImages