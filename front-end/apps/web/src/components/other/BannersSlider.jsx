import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Fragment, useState } from "react";
import { Grid2 as Grid, Skeleton } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useGetBannersQuery } from "../../features/banners/bannersApiSlice";
import Carousel from "react-multi-carousel";

//#region styled
const fadeIn = keyframes`
  from {opacity: 0}
  to {opacity: 1}
`;

const CustomDotButton = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  margin: "0 4px 15px",
  borderRadius: "50%",
  border: ".5px solid",
  cursor: "pointer",
  transition: "width .1s ease",
  borderColor: theme.palette.action.focus,
  backgroundColor: theme.palette.grey[400],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),

  "&.active": {
    width: 20,
    height: 6,
    marginTop: 2,
    opacity: 1,
    borderRadius: 5,
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.main,
  },
}));

const CustomArrowButton = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  border-radius: 50%;
  height: 24px;
  width: 24px;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  opacity: 0.8;
  z-index: 1;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.palette.background.default};
  }

  &.left {
    left: 6px;
  }
  &.right {
    right: 6px;
  }

  svg {
    font-size: inherit;
  }
`;

const BackdropContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 70%;
  opacity: 0.9;
  display: none;
  z-index: -1;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: block;
    overflow: hidden;
  }
`;

const BackdropImage = styled(LazyLoadImage)`
  position: absolute;
  top: 0;
  left: -5%;
  filter: blur(15px);
  width: 110%;
  height: 100%;
  object-fit: fill;
  background-color: ${({ theme }) => theme.palette.action.disabledBackground};
`;

const BackdropPlaceholder = styled(Skeleton)`
  position: absolute;
  top: 0;
  left: -5%;
  width: 110%;
  height: 100%;
`;

const SlideItemContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: visible;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: ${({ theme }) => theme.mixins.toolbar.minHeight + 10}px;
  }
`;

const StyledLazyImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  object-fit: fill;
  background-color: ${({ theme }) => theme.palette.action.disabledBackground};

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 90%;
    background-color: ${({ theme }) => theme.palette.grey[400]};
  }
`;

const StyledSkeleton = styled(Skeleton)`
  width: 100%;
  height: 100%;
  aspect-ratio: 13/5;

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 90%;
    background-color: ${({ theme }) => theme.palette.grey[400]};
  }
`;

const ExtraContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(50% - ${({ theme }) => theme.spacing(0.5)});
  animation: ${fadeIn} 0.5s ease;
`;
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
      min: 0,
    },
    items: 1,
  },
};

const CustomArrow = ({ onClick, className, direction }) => (
  <CustomArrowButton className={`${className} ${direction}`} onClick={onClick}>
    {direction == "left" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
  </CustomArrowButton>
);

const CustomDot = ({ onClick, active }) => {
  return (
    <CustomDotButton className={active ? "active" : ""} onClick={onClick} />
  );
};

function Item({ banner, index }) {
  return (
    <SlideItemContainer key={`banner-${banner?.id}-${index}`}>
      {banner ? (
        <>
          <BackdropContainer>
            <BackdropImage
              aria-hidden
              src={`${banner?.image}?size=tiny`}
              visibleByDefault={index == 0}
              placeholder={
                <BackdropPlaceholder variant="rectangular" animation={false} />
              }
            />
          </BackdropContainer>
          <StyledLazyImage
            src={banner?.image}
            srcSet={`${banner?.image}?size=medium 350w, ${banner?.image} 600w`}
            alt={banner?.name}
            visibleByDefault={index == 0}
            placeholder={
              <StyledSkeleton variant="rectangular" animation={false} />
            }
          />
        </>
      ) : (
        <>
          <BackdropContainer>
            <BackdropPlaceholder variant="rectangular" />
          </BackdropContainer>
          <StyledSkeleton variant="rectangular" animation="wave" />
        </>
      )}
    </SlideItemContainer>
  );
}

function ExtraItem({ banner, index, length, slideIndex }) {
  const showIndex = slideIndex + 1 > length - 1 ? 0 : slideIndex + 1;
  const showIndex2 = slideIndex + 2 > length - 1 ? 1 : slideIndex + 2;

  if (banner) {
    return (
      <ExtraContainer
        key={`extra-${slideIndex}-${banner?.id}-${index}`}
        style={{
          display: index == showIndex || index == showIndex2 ? "flex" : "none",
        }}
      >
        <StyledLazyImage
          src={`${banner?.image}?size=medium`}
          alt={banner?.name}
          visibleByDefault={true}
          placeholder={
            <StyledSkeleton variant="rectangular" animation={false} />
          }
        />
      </ExtraContainer>
    );
  } else {
    return (
      <ExtraContainer>
        <StyledSkeleton variant="rectangular" />
      </ExtraContainer>
    );
  }
}

const BannersSlider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const { data, isLoading, isSuccess, isError } = useGetBannersQuery({
    byShop: false,
  });

  let bannersContent = [];
  let extraBanners = [];

  if (isLoading || isError) {
    bannersContent = <Item />;
    extraBanners = (
      <>
        <ExtraItem />
        <ExtraItem />
      </>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    if (ids?.length) {
      length = ids.length;

      ids?.map((id, index) => {
        const banner = entities[id];
        bannersContent.push(
          <Item
            key={`banner-${banner?.id}-${index}`}
            banner={banner}
            index={index}
          />
        );
        extraBanners.push(
          <Fragment key={`extra-${banner?.id}-${index}`}>
            <ExtraItem
              {...{ banner, index, length: ids?.length, slideIndex }}
            />
          </Fragment>
        );
      });
    } else {
      bannersContent = <Item />;
      extraBanners = (
        <>
          <ExtraItem />
          <ExtraItem />
        </>
      );
    }
  }

  return (
    <Grid
      container
      spacing={1}
      size={12}
      mb={{ xs: 2.5, md: -1 }}
      mt={{ xs: 0, md: 2 }}
    >
      <Grid size={{ xs: 12, md: "grow" }}>
        <Carousel
          responsive={responsive}
          autoPlay
          infinite
          autoPlaySpeed={15000}
          customLeftArrow={<CustomArrow direction="left" />}
          customRightArrow={<CustomArrow direction="right" />}
          removeArrowOnDeviceType={["mobile"]}
          customDot={<CustomDot />}
          beforeChange={(nextSlide) => {
            setSlideIndex(
              nextSlide > 5
                ? nextSlide - 6
                : nextSlide < 2
                  ? nextSlide + 2
                  : nextSlide - 2
            );
          }}
          pauseOnHover
          keyBoardControl
          showDots
          minimumTouchDrag={80}
        >
          {bannersContent}
        </Carousel>
      </Grid>
      <Grid
        size={{ xs: 12, md: 4 }}
        display={{ xs: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
      >
        {extraBanners}
      </Grid>
    </Grid>
  );
};

export default BannersSlider;
