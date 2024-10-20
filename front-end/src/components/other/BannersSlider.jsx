import styled, { keyframes } from "styled-components"
import { Fragment, useState } from "react";
import { Grid2 as Grid, Skeleton } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useGetBannersQuery } from "../../features/banners/bannersApiSlice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

//#region styled
const fadeIn = keyframes`
  from {opacity: 0}
  to {opacity: 1}
`

const CustomDotButton = styled.span`
    width: 8px;
    height: 8px;
    margin: 0 4px 15px;
    border-radius: 50%;
    border: .5px solid ${props => props.theme.palette.divider};
    background-color: ${props => props.theme.palette.grey[200]};
    opacity: .8;
    cursor: pointer;
    transition: all .2s ease;

    &.active {
        width: 20px;
        height: 6px;
        margin-top: 2px;
        opacity: 1;
        border-radius: 5px;
        border-color: ${props => props.theme.palette.primary.dark};
        background-color: ${props => props.theme.palette.primary.main};
    }
`

const CustomArrowButton = styled.button`
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

const BackdropContainer = styled.div`
    position: absolute;
    top: -30%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: .9;
    display: none;
    z-index: -1;

    ${props => props.theme.breakpoints.down("sm")} {
        display: block;
    }
`

const BackdropImage = styled(LazyLoadImage)`
    position: absolute;
    top: 0;
    left: -5%;
    filter: blur(15px);
    width: 110%;
    height: 100%;
    object-fit: fill;
    background-color: ${props => props.theme.palette.action.disabledBackground};
`

const BackdropPlaceholder = styled(Skeleton)`
    position: absolute;
    top: 0;
    left: -5%;
    width: 110%;
    height: 100%;
`

const SlideItemContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: visible;

    ${props => props.theme.breakpoints.down("md")} {
        padding-top: ${props => props.theme.mixins.toolbar.minHeight + 10}px;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    width: 100%;
    height: 100%;
    object-fit: fill;
    background-color: ${props => props.theme.palette.action.disabledBackground};
    
    ${props => props.theme.breakpoints.down("md")} {
        width: 90%;
    }
`

const StyledSkeleton = styled(Skeleton)`
    width: 100%;
    height: 100%;
    aspect-ratio: 13/5;
    
    ${props => props.theme.breakpoints.down("md")} {
        width: 90%;
        background-color: ${props => props.theme.palette.grey[400]};
    }
`

const ExtraContainer = styled.div`
    position: relative;
    width: 100%;
    height: calc(50% - ${props => props.theme.spacing(.5)});
    animation: ${fadeIn} .5s ease;
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

const CustomArrow = ({ onClick, className, children }) => (
    <CustomArrowButton className={className} onClick={() => onClick()}>
        {children}
    </CustomArrowButton>
);

const CustomDot = ({ index, onClick, active }) => {
    return (
        <CustomDotButton
            className={active ? 'active' : ''}
            onClick={e => onClick()}
        />
    );
};

function Item({ banner, index }) {

    return (
        <SlideItemContainer key={`banner-${banner?.id}-${index}`}>
            {banner ? <>
                <BackdropContainer >
                    <BackdropImage
                        aria-hidden
                        src={`${banner?.image}?size=tiny`}
                        visibleByDefault={index == 0}
                        placeholder={<BackdropPlaceholder variant="rectangular" animation={false}/>}
                    />
                </BackdropContainer>
                <StyledLazyImage
                    src={banner?.image}
                    srcSet={`${banner?.image}?size=medium 350w, ${banner?.image} 600w`}
                    alt={banner?.name}
                    visibleByDefault={index == 0}
                    placeholder={<StyledSkeleton variant="rectangular" animation={false}/>}
                />
            </>
                : <>
                    <BackdropContainer>
                        <BackdropPlaceholder variant="rectangular" />
                    </BackdropContainer>
                    <StyledSkeleton variant="rectangular" animation="wave" />
                </>
            }
        </SlideItemContainer>
    )
}

function ExtraItem({ banner, index, length, slideIndex }) {
    const showIndex = slideIndex + 1 > length - 1 ? 0 : slideIndex + 1;
    const showIndex2 = slideIndex + 2 > length - 1 ? 1 : slideIndex + 2;

    if (banner) {
        return (
            <ExtraContainer
                key={`extra-${slideIndex}-${banner?.id}-${index}`}
                style={{ display: (index == showIndex || index == showIndex2) ? 'flex' : 'none' }}
            >
                <StyledLazyImage
                    src={`${banner?.image}?size=medium`}
                    alt={banner?.name}
                    visibleByDefault={true}
                    placeholder={<StyledSkeleton variant="rectangular" animation={false}/>}
                />
            </ExtraContainer>
        )
    } else {
        return (<ExtraContainer><StyledSkeleton variant="rectangular" /></ExtraContainer>)
    }
}

const BannersSlider = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const { data, isLoading, isSuccess, isError } = useGetBannersQuery({ byShop: false });

    let bannersContent = [];
    let extraBanners = [];

    if (isLoading || isError) {
        bannersContent = <Item />
        extraBanners = <><ExtraItem /><ExtraItem /></>
    } else if (isSuccess) {
        const { ids, entities } = data;

        if (ids?.length) {
            length = ids.length;

            ids?.map((id, index) => {
                const banner = entities[id];
                bannersContent.push(<Item key={`banner-${banner?.id}-${index}`} banner={banner} index={index} />);
                extraBanners.push(
                    <Fragment key={`extra-${banner?.id}-${index}`}>
                        <ExtraItem {...{ banner, index, length: ids?.length, slideIndex }} />
                    </Fragment>
                );
            })
        } else {
            bannersContent = <Item />
            extraBanners = <><ExtraItem /><ExtraItem /></>
        }
    }

    return (
        <Grid container spacing={1} size={12} mb={{ xs: 2.5, md: -1 }}>
            <Grid size={{ xs: 12, md: 'grow' }}>
                <Carousel
                    responsive={responsive}
                    autoPlay
                    infinite
                    autoPlaySpeed={15000}
                    customLeftArrow={<CustomArrow className="custom-left-arrow"><KeyboardArrowLeft/></CustomArrow>}
                    customRightArrow={<CustomArrow className="custom-right-arrow"><KeyboardArrowRight/></CustomArrow>}
                    customDot={<CustomDot/>}
                    beforeChange={(nextSlide) => {
                        setSlideIndex(nextSlide > 5 ? nextSlide - 6 : nextSlide < 2 ? nextSlide + 2 : nextSlide - 2);
                    }}
                    removeArrowOnDeviceType={["mobile"]}
                    pauseOnHover
                    keyBoardControl
                    showDots
                    minimumTouchDrag={80}
                >
                    {bannersContent}
                </Carousel>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} display={{ xs: 'none', md: 'flex' }} flexDirection="column" justifyContent="space-between">
                {extraBanners}
            </Grid>
        </Grid>
    )
}

export default BannersSlider