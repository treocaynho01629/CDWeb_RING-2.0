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

const CustomArrowButton = styled.button`
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
    background-clip: content-box;

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
    background-color: ${props => props.theme.palette.action.disabledBackground};
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
        slidesToSlide: 3,
        partialVisibilityGutter: 5
    },
    mobile: {
        breakpoint: {
            max: 900,
            min: 0
        },
        items: 6,
        slidesToSlide: 3,
        partialVisibilityGutter: 5
    }
};

//Custom stuff
const CustomArrow = ({ onClick, className, children }) => (
    <CustomArrowButton className={className} onClick={() => onClick()}>
        {children}
    </CustomArrowButton>
);

const CustomButtonGroup = ({ book, images, goToSlide, carouselState }) => {
    const { currentSlide } = carouselState;

    return (
        <MoreImageContainer>
            <Carousel
                responsive={responsiveMini}
                autoPlay={false}
                customLeftArrow={<CustomArrow className="custom-left-arrow"><KeyboardArrowLeft /></CustomArrow>}
                customRightArrow={<CustomArrow className="custom-right-arrow"><KeyboardArrowRight /></CustomArrow>}
                removeArrowOnDeviceType={["mobile"]}
                minimumTouchDrag={80}
                focusOnSelect={true}
                partialVisible
                draggable
            >
                {book ? images.map((image, index) => (
                    <SmallImageSlide
                        key={index}
                        className={`${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    >
                        <StyledSmallLazyImage
                            src={`${image}?size=small`}
                            placeholder={<StyledSmallSkeleton variant="rectangular" animation={false}/>}
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
    let images = [].concat(book?.previewImages, book?.image);

    return (
        <ImgContainer>
            {book ? <ImageNumber>{slideIndex}/{images.length}</ImageNumber>
                : <ImageNumber>Đang tải</ImageNumber>}
            <Carousel
                renderButtonGroupOutside
                responsive={responsive}
                autoPlay={true}
                pauseOnHover={true}
                arrows={false}
                rewindWithAnimation={true}
                autoPlaySpeed={15000}
                beforeChange={(nextSlide) => { setSlideIndex(nextSlide + 1) }}
                rewind
                keyBoardControl
                draggable
                customButtonGroup={<CustomButtonGroup {...{ setSlideIndex, images, book }} />}
                minimumTouchDrag={80}
            >
                {book ? images.map((image, index) => (
                    <ImageSlide key={index}>
                        <StyledLazyImage
                            src={image}
                            srcSet={`${image}?size=medium 350w, ${image} 600w`}
                            alt={`${book?.title} preview image #${index}`}
                            sizes="400px"
                            visibleByDefault={index == 0}
                            placeholder={<StyledSmallSkeleton variant="rectangular" animation={false}/>}
                        />
                    </ImageSlide>
                ))
                    :
                    <ImageSlide>
                        <StyledSkeleton variant="rectangular" />
                    </ImageSlide>
                }
            </Carousel>
        </ImgContainer >
    )
}

export default ProductImages