import { useRef, useState, useEffect } from "react"
import styled from "styled-components"

import { KeyboardArrowRight, KeyboardArrowLeft, Category as CategoryIcon, Class as ClassIcon, Storefront} from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';

import { Link, useNavigate } from "react-router-dom"

//#region styled
const ItemContainer = styled.div`
    display: flex;
    margin: 0px 3px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 3px 10px;
    border: 2px solid lightgray;
    border-radius: 2%;
    color: inherit;
    transition: all 0.25s ease;

    &:hover{
      background-color: #63e399;
      color: white;
      border-color: white;
      transform: scale(1.05);
    }
`

const Title = styled.p`
    font-size: 14px;
    font-weight: bold;
    margin-left: 10px;
    margin-right: 12px;
    clear: both;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-transform: uppercase;
`

const CateContainer = styled.div`
    display: flex;
    border-bottom: 0.5px solid lightgray;
    justify-content: space-between;
    padding: 5px 10px 5px 15px;
`

const Container = styled.div`
    border: 0.5px solid lightgray;
`

const Wrapper = styled.div`
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
    display: flex;
    padding: 5px 0px 5px 15px;
`

const Arrow = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    opacity: 0.75;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover{
        background-color: #63e399;
        color: white;
        transform: scale(1.05);
    }
`

const Explore = styled.div`
    display: flex; 
    justify-content: center;
    align-items: center;
    padding: 10px 0px;
    background-color: #ebebeb;
    color: #5ea0ec;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover{
        background-color: #63e399;
        color: white;
        text-decoration: underline;
    }
`
//#endregion

const Categories = (props) => {
    const slideRef = useRef();
    const [catesList, setCatesList] = useState([])
    const { loading, data } = props;
    const navigate = useNavigate();

    //Load
    useEffect(()=>{
        loadCategories();
    }, [loading]);

    const loadCategories = async()=>{
        if (!loading){
            setCatesList(data);
        }
    };

    //Scroll
    const scrollSlide = (n) => {
        slideRef.current.scrollLeft += n;
    }

  return (
    <Container>
        <CateContainer>
        <Wrapper draggable={true} ref={slideRef}>
            {(loading ? Array.from(new Array(15)) : catesList)?.map((cate, index) => (
                <div key={index}>
                    {cate ? (
                        <Link to={`/filters?cateId=${cate.id}`} style={{color: '#424242'}}>
                            <ItemContainer>
                                {index % 2 == 0 ? 
                                <CategoryIcon/>
                                : <ClassIcon/>
                                }
                                <Title>{cate.categoryName}</Title>
                            </ItemContainer>
                        </Link>
                    ) : (
                        <Skeleton variant="rectangular" animation="wave" width={150} height={50} sx={{ mx: '3px' }} />
                    )}
                </div>
            ))}
        </Wrapper>
        <ButtonContainer>
            <Arrow direction="left" onClick={()=>scrollSlide(-500)}>
                <KeyboardArrowLeft style={{fontSize: 30}}/>
            </Arrow>
            <Arrow direction="right" onClick={()=>scrollSlide(500)}>
                <KeyboardArrowRight style={{fontSize: 30}}/>
            </Arrow>
        </ButtonContainer>
        </CateContainer>
        <Explore onClick={() => navigate('/filters')}><Storefront/>&nbsp;DUYỆT CỬA HÀNG</Explore>
    </Container>
  )
}

export default Categories