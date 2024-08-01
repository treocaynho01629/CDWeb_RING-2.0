import styled from "styled-components"
import { useRef } from "react"
import { KeyboardArrowRight, KeyboardArrowLeft, Category as CategoryIcon, Class as ClassIcon, Storefront } from '@mui/icons-material';
import { Link } from "react-router-dom"
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import Skeleton from '@mui/material/Skeleton';

//#region styled
const ItemContainer = styled.div`
    display: flex;
    margin: 0px 3px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0px 10px;
    border: 2px solid lightgray;
    border-radius: 2%;
    color: inherit;
    transition: all .3s ease;

    &:hover{
      background-color: ${props => props.theme.palette.secondary.main};
      color: ${props => props.theme.palette.secondary.contrastText};
      border-color: ${props => props.theme.palette.secondary.contrastText};
      transform: scale(1.05);
    }
`

const Title = styled.p`
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    margin-left: 10px;
    margin-right: 12px;
    clear: both;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-transform: uppercase;
`

const CateContainer = styled.div`
    position: relative;
    display: flex;
    border-bottom: 0.5px solid lightgray;
    justify-content: space-between;
    overflow: hidden;
    padding: 5px 10px 5px 15px;

    &:hover {
        .button-container {
            opacity: 1;
            visibility: visible;
        }
    }
`

const Container = styled.div`
    border: 0.5px solid lightgray;
`

const Wrapper = styled.div`
    position: relative;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0;
    height: auto;
    justify-content: space-between;
    overflow-x: scroll;
    scroll-behavior: smooth;
    border-left: 0.5px solid lightgray;
    border-right: 0.5px solid lightgray;

    &::-webkit-scrollbar {
        display: none;
    }
`

const ButtonContainer = styled.div`
    position: absolute;
    right: 5px;
    padding: 5px 0px 5px 15px;
    background-color: ${props => props.theme.palette.background.default};
    border-left: 0.5px solid lightgray;
    display: none;
    transition: all .3s ease;
    opacity: 0;
    visibility: hidden;

    &:hover {
        opacity: 1;
        visibility: visible;
    }

    @media (min-width: 900px) {
        display: flex;
    }
`

const Arrow = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.theme.palette.divider};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    opacity: 0.75;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover{
        background-color: ${props => props.theme.palette.secondary.main};
        color: ${props => props.theme.palette.secondary.contrastText};
        transform: scale(1.05);
    }
`

const Explore = styled.div`
    display: none; 
    justify-content: center;
    align-items: center;
    padding: 10px 0px;
    background-color: #00000057;
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    letter-spacing: .1em;
    cursor: pointer;
    transition: all .3s ease;

    svg {font-size: 1.5em}

    &:hover{
        background-color: ${props => props.theme.palette.secondary.main};
        color: ${props => props.theme.palette.secondary.contrastText};
        text-decoration: underline;
    }

    @media (min-width: 900px) {
        display: flex;
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
                    <Skeleton variant="rectangular" animation="wave" width={150} height={50} sx={{ mx: '3px' }} />
                </div>
            ))
        )
    } else if (isSuccess) {
        const { ids, entities } = categories;

        catesContent = ids?.length
            ? ids?.map((cateId, index) => {
                const cate = entities[cateId];

                return (
                    <Link to={`/filters?cateId=${cateId}`} style={{ color: '#424242' }}>
                        <ItemContainer>
                            {index % 2 == 0 ?
                                <CategoryIcon />
                                : <ClassIcon />
                            }
                            <Title>{cate?.categoryName}</Title>
                        </ItemContainer>
                    </Link>
                )
            })
            : null
    }

    return (
        <Container>
            <CateContainer>
                <Wrapper draggable={true} ref={slideRef}>
                    {catesContent}
                </Wrapper>
                <ButtonContainer className="button-container">
                    <Arrow direction="left" onClick={() => scrollSlide(-500)}>
                        <KeyboardArrowLeft style={{ fontSize: 30 }} />
                    </Arrow>
                    <Arrow direction="right" onClick={() => scrollSlide(500)}>
                        <KeyboardArrowRight style={{ fontSize: 30 }} />
                    </Arrow>
                </ButtonContainer>
            </CateContainer>
            <Link to={'/filters'}>
                <Explore><Storefront />&nbsp;ĐẾN CỬA HÀNG</Explore>
            </Link>
        </Container>
    )
}

export default Categories