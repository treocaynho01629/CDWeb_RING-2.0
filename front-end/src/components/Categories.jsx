import { useRef, useState, useEffect } from "react"
import styled from "styled-components"

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import CategoryIcon from '@mui/icons-material/Category';
import Skeleton from '@mui/material/Skeleton';

import { Link } from "react-router-dom"
import useFetch from "../hooks/useFetch";

const ItemContainer = styled.div`
    display: flex;
    margin: 0px 3px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 3px 10px;
    transition: all 0.5s ease;
    border: 2px solid lightgray;
    border-radius: 5%;

    &:hover{
      background-color: lightgray;
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
`

const Container = styled.div`
    display: flex;
    border: 0.5px solid lightgray;
    justify-content: space-between;
    padding: 0px 15px;
`

const Wrapper = styled.div`
    display: flex;
    padding: 5px 0px;
    height: auto;
    justify-content: space-between;
    overflow-x: scroll;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: none;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    padding: 5px 10px;
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

const CATEGORIES_URL = 'api/categories';

const CateItem = ({cate}) => {
    return (
        <Link to={`/filters?cateId=${cate.id}`} style={{color: 'inherit'}}>
            <ItemContainer>
                <CategoryIcon style={{color: '#63e399'}}/>
                <Title>{cate.categoryName}</Title>
            </ItemContainer>
        </Link>
    )
}

const Categories = () => {

    const slideRef = useRef();
    const [catesList, setCatesList] = useState([])
    const { loading, data } = useFetch(CATEGORIES_URL);

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
      <Wrapper draggable={true} ref={slideRef}>
        {(loading ? Array.from(new Array(15)) : catesList)?.map((cate, index) => (
            <div key={index}>
                {cate ? (
                    <CateItem cate={cate}/>
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
    </Container>
  )
}

export default Categories