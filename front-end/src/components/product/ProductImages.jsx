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
    z-index: 5;
    color: ${props => props.theme.palette.primary.contrastText};
    background-color: ${props => props.theme.palette.primary.main};
    border-radius: 50px;
    top: 5px;
    left: 10px;
    white-space: nowrap;

    ${props => props.theme.breakpoints.down("sm")} {
        bottom: 5px;
        right: 15px;
        top: auto;
        left: auto;
    }
`

const MoreImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
`

const ImageSlider = styled.div`
    padding: 5px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0;
    }
`

const SmallImageSlider = styled.div`
    display: flex;
    overflow-x: scroll;
    width: 95%;
    margin: 0px 10px;
    user-select: none;
    scroll-behavior: smooth;
    white-space: nowrap;
    padding: 10px;

    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {
        display: none;
    }

    ${props => props.theme.breakpoints.down("sm")} {
       padding: 0;
    }
`

const SmallImageSlide = styled.div`
    border: .5px solid ${props => props.theme.palette.action.focus};
    margin-right: 5px;
    cursor: pointer;
    opacity: 0.5;
    transition: all .25s ease;

    ${props => props.theme.breakpoints.down("md")} {
       width: 15%;
    }

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
    transform: ${props => props.imagestyle};
    width: 100%;
`

const StyledSmallLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    object-fit: contain;
    transform: ${props => props.imagestyle};
    width: 70px;
    aspect-ratio: 1/1;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 55px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        width: 45px;
    }
`

const StyledSkeleton = styled(Skeleton)`
    margin: 15px 10px;
    width: 95%;
    height: 100%;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 5px 0 0 0;
        width: 100%;
    }
`

const StyledSmallSkeleton = styled(Skeleton)`
    height: 80px;
    width: 80px;
    margin-right: 5px;

  ${props => props.theme.breakpoints.down("sm")} {
    height: 55px;
    width: 55px;
  }
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

const CustomButtonGroup = ({ multiImages, images, setSlideIndex, goToSlide, carouselState }) => {
    const { currentSlide } = carouselState;

    return (
        <MoreImageContainer>
            <SmallImageSlider draggable={true}>
                {multiImages.map((style, index) => (
                    <SmallImageSlide key={index}
                        className={`${index === currentSlide && 'active'}`}
                        onClick={() => {
                            goToSlide(index);
                            setSlideIndex(index + 1);
                        }}>
                        <StyledSmallLazyImage
                            src={`${images}?size=small`}
                            imagestyle={style}
                            placeholder={
                                <StyledSmallSkeleton
                                    variant="rectangular"
                                    animation={false}
                                />
                            }
                        />
                    </SmallImageSlide>
                ))}
            </SmallImageSlider>
        </MoreImageContainer>
    );
};

const ProductImages = ({ book }) => {
    const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)', 'scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)']; //Temp
    const [slideIndex, setSlideIndex] = useState(1);

    if (book) {
        const images = book?.image;

        return (
            <ImgContainer>
                <ImageNumber>{slideIndex}/{multiImages.length}</ImageNumber>
                <Carousel
                    renderButtonGroupOutside
                    responsive={responsive}
                    autoPlay={true}
                    autoPlaySpeed={60000}
                    customLeftArrow={<CustomLeftArrow setSlideIndex={setSlideIndex} />}
                    customRightArrow={<CustomRightArrow setSlideIndex={setSlideIndex} />}
                    customButtonGroup={<CustomButtonGroup {...{ setSlideIndex, images, multiImages }} />}
                    removeArrowOnDeviceType={["mobile"]}
                    pauseOnHover
                    keyBoardControl
                    minimumTouchDrag={80}
                >
                    {multiImages.map((style, index) => (
                        <ImageSlide key={index}>
                            <StyledLazyImage
                                src={images}
                                srcSet={`${images}?size=medium 350w, ${images} 600w`}
                                alt={`${book?.title} preview image #${index}`}
                                sizes="400px"
                                imagestyle={style}
                                visibleByDefault={index == 0}
                                placeholderSrc={`${images}?size=small`}
                                effect="blur"
                            />
                        </ImageSlide>
                    ))}
                </Carousel>
            </ImgContainer>
        )
    } else {
        return (
            <ImgContainer>
                <ImageSlider>
                    <StyledSkeleton
                        variant="rectangular"
                    />
                </ImageSlider>
                <MoreImageContainer>
                    <SmallImageSlider>
                        {Array.from(new Array(4)).map((item, index) => (
                            <StyledSmallSkeleton
                                key={index}
                                variant="rectangular"
                            />
                        ))}
                    </SmallImageSlider>
                </MoreImageContainer>
            </ImgContainer>
        )
    }
}

export default ProductImages