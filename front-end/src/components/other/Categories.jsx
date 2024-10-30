import styled from "styled-components"
import { useRef, Fragment } from "react"
import { IconButton, Skeleton } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import { Link } from "react-router-dom"
import { useGetPreviewCategoriesQuery } from "../../features/categories/categoriesApiSlice";
import { LazyLoadImage } from 'react-lazy-load-image-component';

//#region styled
const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    height: 65px;
    width: 65px;
    object-fit: contain;

    ${props => props.theme.breakpoints.down("md_lg")} {
        height: 55px;
        width: 55px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        height: 45px;
        width: 45px;
    }
`

const ItemContainer = styled.div`
    padding: 4px 0;
    width: 100px;
    height: 115px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: .5px solid transparent;
    cursor: pointer;
    transition: all .25s ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${props => props.theme.palette.action.focus};
      box-shadow: ${props => props.theme.shadows[1]};
      ${StyledLazyImage} { filter: saturate(120%)}
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        width: 90px;
        height: 100px;
        font-size: 13px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 2px;
        width: 70px;
        height: 95px;
        font-size: 12px;
    }
`

const CateContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    &:hover {
        .button-container {
            opacity: 1;
            visibility: visible;
        }
    }
`

const ItemWrapper = styled.div`
    display: flex;
`

const ItemName = styled.span`
    margin-top: 5px;
    font-weight: bold;
    text-transform: capitalize;
    width: 100%;
    text-align: center;
`

const Wrapper = styled.div`
    position: relative;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    overflow-x: scroll;
    scroll-behavior: smooth;

    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {display: none;}

    ${props => props.theme.breakpoints.up("md")} {
        ${ItemWrapper}:first-child {margin-left: 20px;}
        ${ItemWrapper}:last-child { margin-right: 40px; }
    }
`

const ButtonContainer = styled.div`
    position: absolute;
    right: 5px;
    padding-left: 20px;
    height: 100%;
    background-image: linear-gradient(
        to left, 
        ${props => props.theme.palette.background.default}, 
        ${props => props.theme.palette.background.default} 80%,
        transparent 100%);
    display: flex;
    align-items: center;
    transition: all .25s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 2;

    &:hover {
        opacity: 1;
        visibility: visible;
    }

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`
//#endregion

const Categories = () => {
    const { data: categories, isLoading, isSuccess, isError } = useGetPreviewCategoriesQuery();
    const slideRef = useRef();

    //Scroll
    const scrollSlide = (n) => { slideRef.current.scrollLeft += n }

    let catesContent;

    if (isLoading || isError) {
        catesContent = (
            Array.from(new Array(15)).map((item, index) => (
                <ItemWrapper key={`cate-${index}`}>
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        width={100}
                        sx={{ mx: '3px' }}
                    />
                </ItemWrapper>
            ))
        )
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesContent = ids?.length
            ? ids?.map((cateId, index) => {
                const cate = entities[cateId];

                return (
                    <Fragment key={`main-${cateId}-${index}`}>
                        <ItemWrapper key={`cate-${cateId}-${index}`}>
                            <Link to={`/store/${cate?.slug}?cate=${cateId}`} title={cate?.categoryName}>
                                <ItemContainer>
                                    <StyledLazyImage
                                        src={`${cate?.image}?size=tiny`}
                                        alt={`Category item: ${cate?.categoryName}`}
                                        placeholder={<Skeleton width={65} height={65} variant="rectangular" animation={false}/>}
                                    />
                                    <ItemName>{cate?.categoryName}</ItemName>
                                </ItemContainer>
                            </Link>
                        </ItemWrapper>
                    </Fragment>
                )
            })
            : null
    }

    return (
        <CateContainer>
            <Wrapper draggable={true} ref={slideRef}>
                {catesContent}
            </Wrapper>
            <ButtonContainer className="button-container">
                <div>
                    <IconButton aria-label="Scroll categories to left" onClick={() => scrollSlide(-500)}>
                        <KeyboardArrowLeft fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Scroll categories to right" onClick={() => scrollSlide(500)}>
                        <KeyboardArrowRight fontSize="small" />
                    </IconButton>
                </div>
            </ButtonContainer>
        </CateContainer>
    )
}

export default Categories