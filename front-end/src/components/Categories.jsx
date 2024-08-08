import styled from "styled-components"
import { useRef } from "react"
import { IconButton, Skeleton } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import { Link } from "react-router-dom"
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";

//#region styled
const ItemContainer = styled.div`
    margin: 0px 3px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    text-transform: capitalize;
    background-color: ${props => props.theme.palette.divider};
    cursor: pointer;
    transition: all .25s ease;

    &:hover {
      background-color: ${props => props.theme.palette.secondary.main};
      color: ${props => props.theme.palette.secondary.contrastText};
      transform: scale(1.025);
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

    &::before, &::after {
        position: absolute;
        top: 0;
        width: 10%;
        height: 100%;
        content: "";
        z-index: 1;
        pointer-events: none;
    }

    &:before {
        left: 0;
        background-image: linear-gradient(to right, ${props => props.theme.palette.background.default}, transparent 90%);
    }

    &:after {
        right: 0;
        background-image: linear-gradient(to left, ${props => props.theme.palette.background.default}, transparent 90%);
    }
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

    &::-webkit-scrollbar {
        display: none;
    }

    a:first-child {
        margin-left: 20px;
    }

    a:last-child {
        margin-right: 40px;
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
    const { data: categories, isLoading, isSuccess, isError } = useGetCategoriesQuery();
    const slideRef = useRef();

    //Scroll
    const scrollSlide = (n) => {
        slideRef.current.scrollLeft += n;
    }

    let catesContent;

    if (isLoading || isError) {
        catesContent = (
            Array.from(new Array(15)).map((index) => (
                <div key={index}>
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        height={40}
                        width={100}
                        sx={{ mx: '3px' }}
                    />
                </div>
            ))
        )
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesContent = ids?.length
            ? ids?.map((cateId, index) => {
                const cate = entities[cateId];

                return (
                    <>
                        <Link
                            to={`/filters?cateId=${cateId}`}
                            style={{ color: 'inherit' }}
                            title={cate?.categoryName}
                            key={`${cateId}-${index}`}
                        >
                            <ItemContainer>{cate?.categoryName}</ItemContainer>
                        </Link>
                        {
                            cate?.cateSubs?.map((sub, subIndex) => (
                                <Link
                                    to={`/filters?cateId=${cateId}`}
                                    style={{ color: 'inherit' }}
                                    title={sub?.subName}
                                    key={`${sub}-${subIndex}`}
                                >
                                    <ItemContainer>{sub?.subName}</ItemContainer>
                                </Link>
                            ))
                        }
                    </>
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
                <IconButton aria-label="Scroll categories to left" onClick={() => scrollSlide(-500)}>
                    <KeyboardArrowLeft fontSize="small" />
                </IconButton>
                <IconButton aria-label="Scroll categories to right" onClick={() => scrollSlide(500)}>
                    <KeyboardArrowRight fontSize="small" />
                </IconButton>
            </ButtonContainer>
        </CateContainer>
    )
}

export default Categories