import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import { Close } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Backdrop, Modal, Skeleton } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Carousel from 'react-multi-carousel';

//#region styled
const ImgContainer = styled.div`
    text-align: center;
    background-color: ${props => props.theme.palette.background.paper};
    border: none;

    .react-multi-carousel-list{
      position: unset !important;
    }
    
    ${props => props.theme.breakpoints.up("md")} {
        width: 100%;
        position: sticky;
        top: ${props => props.theme.mixins.toolbar.minHeight + 15}px;
        border: .5px solid ${props => props.theme.palette.divider};
    }
`

const ImageNumber = styled.span`
    font-size: 14px;
    font-weight: 420;
    padding: 2px 8px;
    position: absolute;
    color: white;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50px;
    top: ${props => props.theme.spacing(3)};
    left: ${props => props.theme.spacing(3)};
    opacity: .9;
    z-index: 5;
    pointer-events: none;

    ${props => props.theme.breakpoints.down("md")} {
        bottom: ${props => props.theme.spacing(3)};
        right: ${props => props.theme.spacing(3)};
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
    aspect-ratio: 1/1;
    margin-right: ${props => props.theme.spacing(.5)};
    cursor: pointer;
    transition: opacity .25s ease;

    &.active {
        border: 3px solid ${props => props.theme.palette.primary.main};
        opacity: 1;
    }

    &:hover {
        border: 1px solid ${props => props.theme.palette.primary.light};
        opacity: 1;
    }
`

const CustomArrowButton = styled.div`
  position: absolute;
  background-color: ${props => props.theme.palette.background.paper};
  border: .5px solid ${props => props.theme.palette.divider};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  font-size: 1.75em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s ease;
  cursor: pointer;
  opacity: .8;
  z-index: 1;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &.left { left: -10px; }
  &.right { right: -10px; }

  svg { font-size: inherit; }
`

const ImageSlide = styled.div`
    padding: 10px;
    padding-bottom: 0;
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 450px;
    aspect-ratio: 1/1;
    background-clip: content-box;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0;
        border: none;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    object-fit: contain;
    width: 100%;
    max-height: 450px;
    aspect-ratio: 1/1;
    cursor: pointer;
`

const StyledSkeleton = styled(Skeleton)`
    width: 100%;
    height: 100%;
    max-height: 450px;
    aspect-ratio: 1/1;
`

const StyledSmallLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    object-fit: contain;
    width: 100%;
    aspect-ratio: 1/1;
    background-color: ${props => props.theme.palette.action.disabledBackground};
`

const StyledSmallSkeleton = styled(Skeleton)`
    display: inline-block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
`

const CloseButton = styled.button`
    position: absolute;
    border: none;
    outline: none;
    background-color: transparent;
    right: ${props => props.theme.spacing(4)};
    top: ${props => props.theme.spacing(4)};
    text-align: center;
    opacity: .8;
    cursor: pointer;
    transition: all .2s ease;
    z-index: 1;

    svg { font-size: 40px; }

    &:hover {
        opacity: 1;
    }

    &:after {
        content: "Đóng";
    }

    ${props => props.theme.breakpoints.down("md")} {
        color: ${props => props.theme.palette.text.primary};
        right: ${props => props.theme.spacing(1.5)};
        top: ${props => props.theme.spacing(1.5)};

        &:after { display: none; }
    }
`

const FullscreenBackdrop = styled(Backdrop)`
    background-color: rgba(0, 0, 0, .95);
    z-index: -1;

    ${props => props.theme.breakpoints.down("sm")} {
        background-color: ${props => props.theme.palette.background.paper};
    }
`

const TopContainer = styled.div`
    position: relative;

    ${CustomArrowButton} {
        display: none;
    }
`

const SubContainer = styled.div`
    width: 100%;

    p {
        color: ${props => props.theme.palette.primary.dark};
        font-weight: 450;
        font-size: 18px;
        padding-bottom: 10px;
        border-bottom: 1px solid ${props => props.theme.palette.primary.main};
    }
`

const FullscreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    padding: ${props => props.theme.spacing(2.5)};

    .react-multi-carousel-track{
      height: 100% !important;
    }

    ${StyledLazyImage} {
        max-height: 550px;
        height: 100%;
    }

    ${StyledSkeleton} {
        max-height: 550px;
        height: 100%;
    }

    ${MoreImageContainer} {
        max-width: 950px;
        margin-left: auto;
        margin-right: auto;
        padding: 0;
    }

    ${StyledSmallLazyImage} {
        max-height: 75px;
    }

    ${StyledSmallSkeleton} {
        max-height: 75px;
    }

    ${SmallImageSlide} {
        filter: grayscale(1);
        opacity: 1;
        max-height: 75px;

        &.active {
            filter: none;
            border: 3px solid ${props => props.theme.palette.primary.main};
            opacity: 1;
        }
    }

    ${CustomArrowButton} {
        width: 50px;
        height: 50px;
        font-size: 3.25em;
        background-color: transparent;
        color: white;
        border-color: white;

        &.left { left: 10%; }
        &.right { right: 10%; }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: ${props => props.theme.spacing(2)} 0;
    }
`
//#endregion

const responsive = {
    default: {
        breakpoint: {
            max: 3000,
            min: 900,
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

const responsiveGroup = {
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

const responsiveFullscreen = {
    default: {
        breakpoint: {
            max: 3000,
            min: 900
        },
        items: 12,
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
const CustomArrow = ({ onClick, className, direction }) => (
    <CustomArrowButton className={`${className} ${direction}`} onClick={onClick}>
        {direction == 'left' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
    </CustomArrowButton>
);

const ButtonGroup = ({ book, images, goToSlide, currentSlide, responsive }) => {
    return (
        <MoreImageContainer>
            <Carousel
                responsive={responsive}
                autoPlay={false}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                removeArrowOnDeviceType={["mobile"]}
                minimumTouchDrag={80}
                partialVisible
            >
                {book ? images.map((image, index) => (
                    <SmallImageSlide
                        key={index}
                        className={`${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    >
                        <StyledSmallLazyImage
                            src={`${image}?size=small`}
                            placeholder={<StyledSmallSkeleton variant="rectangular" animation={false} />}
                        />
                    </SmallImageSlide>
                ))
                    : [...Array(4)].map((item, index) => (
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
    let sliderRef = useRef();
    const [slideIndex, setSlideIndex] = useState(1);
    const [open, setOpen] = useState(false);
    let images = book?.previews ? [].concat(book?.image, book.previews) : [].concat(book?.image);

    const goToSlide = (index) => { if (sliderRef?.goToSlide) sliderRef.goToSlide(index) }
    const handleOpen = () => { setOpen(true); }
    const handleClose = () => { setOpen(false); }

    let carousel = (
        <Carousel
            ref={e => sliderRef = e}
            responsive={responsive}
            autoPlay={!open}
            customLeftArrow={<CustomArrow direction="left" />}
            customRightArrow={<CustomArrow direction="right" />}
            removeArrowOnDeviceType={["mobile"]}
            pauseOnHover={true}
            arrows={open}
            rewindWithAnimation={true}
            autoPlaySpeed={15000}
            transitionDuration={200}
            beforeChange={(nextSlide) => { setSlideIndex(nextSlide) }}
            rewind
        >
            {book ? images.map((image, index) => (
                <ImageSlide key={index} onClick={handleOpen}>
                    <StyledLazyImage
                        src={image}
                        srcSet={`${image}?size=medium 350w, ${image} 600w`}
                        alt={`${book?.title} preview image #${index}`}
                        visibleByDefault={index == 0}
                        placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                    />
                </ImageSlide>
            ))
                :
                <ImageSlide>
                    <StyledSkeleton variant="rectangular" />
                </ImageSlide>
            }
        </Carousel>
    )

    return (
        <>
            <ImgContainer>
                <TopContainer>
                    {book ? <ImageNumber>{slideIndex + 1}/{images.length}</ImageNumber>
                        : <ImageNumber>Đang tải...</ImageNumber>}
                    {carousel}
                </TopContainer>
                <ButtonGroup {...{ images, book, goToSlide, currentSlide: slideIndex, responsive: responsiveGroup }} />
            </ImgContainer>
            <Modal
                open={open}
                onClose={handleClose}
                disableScrollLock={false}
                slots={{ backdrop: FullscreenBackdrop }}
                aria-labelledby="fullscreen-images-carousel"
                aria-describedby="Views images"
            >
                <FullscreenContainer>
                    <CloseButton onClick={handleClose}><Close /><br /></CloseButton>
                    {carousel}
                    <SubContainer>
                        <p>Hình ảnh từ RING! ({images.length})</p>
                        <ButtonGroup {...{ images, book, goToSlide, currentSlide: slideIndex, responsive: responsiveFullscreen }} />
                    </SubContainer>
                </FullscreenContainer>
            </Modal >
        </>
    )
}

export default ProductImages