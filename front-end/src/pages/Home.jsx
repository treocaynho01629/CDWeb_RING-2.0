import { useState, useEffect } from "react";
import Categories from '../components/Categories'
import Navbar from '../components/Navbar'
import Products from '../components/Products'
import Slider from '../components/Slider'
import Footer from '../components/Footer'

import styled from 'styled-components'
import { Grid } from '@mui/material'
import Divider from '@mui/material/Divider';

import { styled as muiStyled } from '@mui/system';
import ProductsSlider from '../components/ProductsSlider'
import axios from '../api/axios'

const Container = styled.div`
`

const Title = muiStyled(Divider)({
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#63e399',
    textAlign: 'center',
    justifyContent: 'center',
    margin: '10px 0px',
});

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

    @media (min-width: 768px) {
        width: 750px;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

const BOOKS_FETCH_URL = 'api/books/filters?pageNo=0&pSize=15';
const BOOKS_RANDOM_URL = 'api/books/random?amount=10';

const Home = () => {

  const [booksList, setBooksList] = useState([])

  //Load
  useEffect(()=>{
    loadBooks();
  }, []);

  const loadBooks = async()=>{
    const result = await axios.get(BOOKS_FETCH_URL);
    setBooksList(result.data.content);
  };

  return (
    <Container>
      <Navbar/>
        <Wrapper>
          <Slider/>
          <Categories/>
          <Grid sx={{my: 3}} container spacing={5}>
            <Grid item xs={12} md={12}>
              <Title>DANH MỤC SẢN PHẨM</Title>
              <Products booksList={booksList}/>
              <ProductsSlider url={BOOKS_RANDOM_URL}/>
              {/* <ProductsSlider/> */}
              {/* <ProductsSlider/> */}
            </Grid>
          </Grid>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default Home