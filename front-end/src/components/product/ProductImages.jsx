import styled, { keyframes } from 'styled-components'
import { useRef, useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

//#region styled
const fadeIn = keyframes`
  from { opacity: 0}
  to { opacity: 1 }
`

const ImgContainer = styled.div`
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 0.5px solid ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.up("sm")} {
        width: 100%;
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

const ImageSlide = styled.div`
    position: relative;
    width: 100%;
    animation: ${fadeIn} .3s ease;
    align-items: center;
    justify-content: center;
`

const ImageNumber = styled.p`
    color: inherit;
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
    display: flex;

    &.active {
        border: 1px solid ${props => props.theme.palette.primary.main};
        opacity: 1;
    }

    &:hover {
        border: 1px solid ${props => props.theme.palette.primary.light};
        opacity: 1;
    }
`

const ImageButton = styled.button`
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
    transition: all .3s ease;
    top: 50%;
    opacity: .8;
    left: ${prop => prop.direction === "left" && "2%"};
    right: ${prop => prop.direction === "right" && "2%"};

    &:hover{
        opacity: 1;
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.primary.contrastText};
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    padding: 15px 10px;
    object-fit: contain;
    transform: ${props => props.imagestyle};
    width: 95%;
    min-height: 500px;

  ${props => props.theme.breakpoints.down("sm")} {
    padding: 5px 0;
    min-height: 300px;
    width: 85%;
  }
`

const StyledSmallLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    object-fit: contain;
    transform: ${props => props.imagestyle};
    height: 80px;
    width: 80px;

  ${props => props.theme.breakpoints.down("sm")} {
    height: 55px;
    width: 55px;
  }
`

const StyledSkeleton = styled(Skeleton)`
    margin: 15px 10px;
    width: 95%;
    min-height: 500px;

  ${props => props.theme.breakpoints.down("sm")} {
    padding: 5px 0;
    min-height: 300px;
    width: 85%;
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

const ProductImages = ({ images }) => {
    const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)']; //Temp

    const [width, setWidth] = useState(0);
    const [start, setStart] = useState(0);
    const [change, setChange] = useState(9);

    const [slideIndex, setSlideIndex] = useState(1);

    const slideRef = useRef();

    useEffect(() => {
        if (!slideRef.current) return;
        const scrollWidth = slideRef.current.scrollWidth;
        const childrenElementCount = slideRef.current.childElementCount;
        const width = scrollWidth / childrenElementCount;
        setWidth(width);
    }, [])

    useEffect(() => {
        if (!slideRef.current || !width) return;
        let numOfThumb = Math.round(slideRef.current.offsetWidth / width);
        slideRef.current.scrollLeft = slideIndex > numOfThumb - 1 ? (slideIndex - 1) * width : 0;
    }, [width, slideIndex])

    //Slide
    const changeSlide = (n) => {
        setSlideIndex(prev => prev + n);

        if ((slideIndex + n) > multiImages.length) {
            setSlideIndex(1)
        }
        if ((slideIndex + n) < 1) {
            setSlideIndex(multiImages.length)
        }
    }

    //Drag
    const dragStart = (e) => {
        setStart(e.clientX);
    }

    const dragOver = (e) => {
        let touch = e.clientX;
        setChange(start - touch);
    }

    const dragEnd = (e) => {
        if (change > 0) {
            slideRef.current.scrollLeft += width;
        } else {
            slideRef.current.scrollLeft -= width;
        }
    }

    if (images) {
        return (
            <ImgContainer>
                <ImageSlider>
                    {multiImages.map((style, index) => (
                        <ImageSlide key={index}
                            style={{ display: (index + 1) === slideIndex ? "flex" : "none" }}>
                            <ImageNumber>{index + 1} / {multiImages.length}</ImageNumber>
                            <StyledLazyImage
                                src={images}
                                srcSet={`${images}?size=medium 350w, ${images} 600w`}
                                alt={`Big image number ${index}`}
                                sizes='400px'
                                imagestyle={style}
                                visibleByDefault={index == 0}
                                placeholder={
                                    <StyledSkeleton
                                        variant="rectangular"
                                        animation={false}
                                    />
                                }
                            />
                        </ImageSlide>
                    ))}
                    <ImageButton direction="left" onClick={() => changeSlide(-1)}>
                        <KeyboardArrowLeft style={{ fontSize: 50 }} />
                    </ImageButton>
                    <ImageButton direction="right" onClick={() => changeSlide(1)}>
                        <KeyboardArrowRight style={{ fontSize: 50 }} />
                    </ImageButton>
                </ImageSlider>
                <MoreImageContainer>
                    <SmallImageSlider
                        draggable={true}
                        ref={slideRef}
                        onDragStart={dragStart}
                        onDragOver={dragOver}
                        onDragEnd={dragEnd}
                    >
                        {multiImages.map((style, index) => (
                            <SmallImageSlide key={index}
                                className={`${index + 1 === slideIndex && 'active'}`}
                                onClick={() => setSlideIndex(index + 1)}>
                                <StyledSmallLazyImage
                                    src={images}
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