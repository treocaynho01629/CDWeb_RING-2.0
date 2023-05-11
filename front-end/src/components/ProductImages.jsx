import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

const ImgContainer = styled.div`
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 0.5px solid lightgray;
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
`

const ImageSlide = styled.div`
    position: relative;
    transition: all 1.0s ease;
`

const ImageNumber = styled.p`
    color: inherit;
    font-size: 16px;
    font-weight: bold;
    padding: 8px 12px;
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
`

const Image = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    padding: 15px;
`
const SmallImageSlider = styled.div`
    display: flex;
    overflow-x: scroll;
    margin: 0px 10px;
    padding: 10px;
    user-select: none;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: none;
    }
`

const SmallImageSlide = styled.div`
    border: 0.5px solid lightgray;
    margin-right: 5px;
    cursor: pointer;
    opacity: 0.5;
    transition: all 0.5s ease;

    &.active {
        border: 1px solid #63e399;
        opacity: 1;
    }

    &:hover {
        border: 1px solid #00ff6a;
        opacity: 1;
    }
`

const SmallImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    display: inline-block;
`

const ImageButton = styled.div`
    width: 35px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    cursor: pointer;
    transition: all 0.5s ease;
    color: inherit;
    position: absolute;
    top: 50%;
    left: ${prop=> prop.direction === "left" && "2%"};
    right: ${prop=> prop.direction === "right" && "2%"};

    &:hover{
        background-color: #63e399;
        color: white;
    }
`

const ProductImages = ({images}) => {

    const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)'];

    const [width, setWidth] = useState(0);
    const [start, setStart] = useState(0);
    const [change, setChange] = useState(9);

    const [slideIndex, setSlideIndex] = useState(1);

    const slideRef = useRef();

    useEffect(() => {
        if(!slideRef.current) return;
        const scrollWidth = slideRef.current.scrollWidth;
        const childrenElementCount = slideRef.current.childElementCount;
        const width = scrollWidth / childrenElementCount;
        setWidth(width);
    }, [])

    useEffect(() => {
        if(!slideRef.current || !width) return;
        let numOfThumb = Math.round(slideRef.current.offsetWidth / width);
        slideRef.current.scrollLeft = slideIndex > numOfThumb - 1 ? (slideIndex - 1) * width : 0;
    }, [width, slideIndex])

    //Slide
    const changeSlide = (n) => {
        setSlideIndex(prev => prev + n);

        if ((slideIndex + n) > multiImages.length){
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
        if (change > 0){
            slideRef.current.scrollLeft += width;
        } else {
            slideRef.current.scrollLeft -= width;
        }
    }

  return (
    <ImgContainer>
        <ImageSlider>
            {multiImages.map((style, index) => (
            <ImageSlide key={index}
            style={{display: (index + 1) === slideIndex ? "block" : "none"}}>
                <ImageNumber>{index + 1} / {multiImages.length}</ImageNumber>
                <Image src={images} style={{transform: style}}/>        
            </ImageSlide>
            ))}
            <ImageButton direction="left" onClick={()=>changeSlide(-1)}>
                <KeyboardArrowLeft style={{fontSize: 50}}/>
            </ImageButton>
            <ImageButton direction="right" onClick={()=>changeSlide(1)}>
                <KeyboardArrowRight style={{fontSize: 50}}/>
            </ImageButton>
        </ImageSlider>
        <MoreImageContainer>
            <SmallImageSlider draggable={true} ref={slideRef}
            onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragEnd}>
                {multiImages.map((style, index) => (
                <SmallImageSlide key={index} 
                className={`${index + 1 === slideIndex && 'active'}`}
                onClick={()=>setSlideIndex(index + 1)}>
                        <SmallImage src={images} style={{transform: style}}/>
                </SmallImageSlide>
                ))}
            </SmallImageSlider>
        </MoreImageContainer>    
    </ImgContainer>
  )
}

export default ProductImages