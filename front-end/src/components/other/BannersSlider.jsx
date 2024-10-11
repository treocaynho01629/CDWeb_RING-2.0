import styled from "styled-components"
import { Grid2 as Grid, Skeleton } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useGetBannersQuery } from "../../features/banners/bannersApiSlice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState } from "react";

//#region styled
const Wrapper = styled.div`
    padding: 20px;
`

const ExtraContainer = styled.div`
    position: relative;
    width: 100%;
    flex-grow: 1;
`

const CustomDotButton = styled.span`
    width: 8px;
    height: 8px;
    margin: 0 4px 15px;
    border-radius: 50%;
    border: .5px solid ${props => props.theme.palette.divider};
    background-color: ${props => props.theme.palette.common.white};
    opacity: .8;
    cursor: pointer;
    transition: all .2s ease;

    &.active {
        width: 20px;
        opacity: 1;
        border-radius: 5px;
        border-color: ${props => props.theme.palette.primary.dark};
        background-color: ${props => props.theme.palette.primary.light};
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
    /* height: 320px; */
`

const StyledLazyImage = styled(LazyLoadImage)`
    width: 100%;
    object-fit: cover;
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

const CustomLeftArrow = ({ carouselState, onClick, setSlideIndex }) => (
    <CustomArrow
        className="custom-left-arrow"
        onClick={() => {
            onClick();
            setSlideIndex(carouselState?.currentSlide - 1);
        }}
    >
        <KeyboardArrowLeft />
    </CustomArrow>
);

const CustomRightArrow = ({ carouselState, onClick, setSlideIndex }) => {
    // console.log(carouselState);
    return (<CustomArrow
        className="custom-right-arrow"
        onClick={() => {
            onClick();
            setSlideIndex(carouselState?.currentSlide + 1);
        }}
    >
        <KeyboardArrowRight />
    </CustomArrow>)
};

const CustomDot = ({ index, onClick, active, setSlideIndex, carouselState }) => {
    return (
        <CustomDotButton
            className={active ? 'active' : ''}
            onClick={e => {
                onClick();
                setSlideIndex(index);
                e.preventDefault();
            }}
        />
    );
};

function Item({ banner, index }) {
    return (
        <SlideItemContainer key={`banner-${banner?.id}-${index}`} >
            <StyledLazyImage
                src={banner?.image}
                srcSet={`${banner?.image}?size=medium 350w, ${banner?.image} 600w`}
                alt={banner?.name}
                visibleByDefault={index == 0}
            // placeholder={
            //     <Skeleton
            //         variant="rectangular"
            //         // height={400}
            //         sx={{ width: { xs: '80%', md: '100%' } }}
            //         animation={false}
            //     />
            // }
            />
        </SlideItemContainer>
    )
}

function ExtraItem({ banner, index, length, slideIndex }) {
    const showIndex = slideIndex + 1 > length - 1 ? 0 : slideIndex + 1;
    const showIndex2 = slideIndex + 2 > length - 1 ? 1 : slideIndex + 2;
    // console.log(slideIndex)

    if (true) {
        return (
            <ExtraContainer key={`extra-${banner?.id}-${index}`} style={{ display: (index == showIndex || index == showIndex2) ? 'block' : 'none' }}>
                <StyledLazyImage
                    src={banner?.image}
                    srcSet={`${banner?.image}?size=medium 350w, ${banner?.image} 600w`}
                    alt={banner?.name}
                    visibleByDefault={true}
                    placeholder={
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation={false}
                        />
                    }
                />
            </ExtraContainer>
        )
    }
}

const BannersSlider = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const { data, isLoading, isSuccess, isError } = useGetBannersQuery({ byShop: false });

    let bannersContent = [];
    let extraBanners = [];
    let length = 0;

    if (isLoading || isError) {
        bannersContent = <Item />
        extraBanners = <>
            <ExtraItem />
            <ExtraItem />
        </>
    } else if (isSuccess) {
        const { ids, entities } = data;

        if (ids?.length) {
            length = ids.length;

            ids?.map((id, index) => {
                const banner = entities[id];
                bannersContent.push(<Item banner={banner} index={index} />);
                extraBanners.push(
                    <Grid size={12} key={`extra-${banner?.id}-${index}`}>
                        <ExtraItem {...{ banner, index, length: ids?.length, slideIndex }} />
                    </Grid>
                );
            })
        } else {
            bannersContent = <Item />
            extraBanners = <>
                <ExtraItem />
                <ExtraItem />
            </>
        }
    }

    return (
        <Grid container spacing={1} size={12} mb={2}>
            <Grid size={{ xs: 12, md: 'grow' }}>
                <Carousel
                    responsive={responsive}
                    autoPlay
                    infinite
                    autoPlaySpeed={15000}
                    customLeftArrow={<CustomLeftArrow setSlideIndex={setSlideIndex} />}
                    customRightArrow={<CustomRightArrow setSlideIndex={setSlideIndex} />}
                    customDot={<CustomDot setSlideIndex={setSlideIndex} />}
                    beforeChange={(nextSlide, { currentSlide, onMove }) => {
                        console.log(currentSlide + 2);
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
            <Grid container spacing={0} size={{ xs: 12, md: 4 }} display={{ xs: 'none', md: 'flex' }} flexDirection="column">
                {extraBanners}
            </Grid>
        </Grid>
    )
}

export default BannersSlider