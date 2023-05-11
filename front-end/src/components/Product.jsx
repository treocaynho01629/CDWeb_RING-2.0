import { useState } from 'react'

import styled from 'styled-components'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { Divider } from '@mui/material'
import { styled as muiStyled } from '@mui/system'

import Rating from '@mui/material/Rating'
import { useSnackbar } from 'notistack';

import { Link } from "react-router-dom"
import { addToCart } from '../redux/cartReducer';
import { useDispatch } from 'react-redux';

const MoreInfo = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: -10%;
    z-index: 3;
    display: flex;
    justify-content: end;
    align-items: center;
    transition: all 0.5s ease;
    cursor: pointer;
`

const Image = styled.img`
    height: 300px;
    width: 210px;
    z-index: -1;
    transition: all 0.5s ease;
    margin-bottom: 5px;
    object-fit: contain;
    
`

const ImageSlider = styled.div`
    overflow: hidden;
    position: relative;
    z-index: -1;
    padding: 10px 20px 20px 20px;
`

const Container = styled.div`
    max-width: 290px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border: 0.5px solid lightgray;

    &:hover ${MoreInfo}{
        opacity: 1;
    };

    &:hover ${Image}{
        transform: scale(1.05);
    }
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    margin-top: -20px;
    width: 90%;
    z-index: 4;
`

const Brand = styled.h5`
    font-size: 16px;
    margin: 0;
    color: inherit;
`

const Title = styled.h5`
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
`

const Price = styled.span`
    font-size: 16px;
    color: gray;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    margin: 5px 0 5px 0;
`

const Percent = styled.p`
    color: #63e399;
    margin: 0 0 0 10px;
`

const Sale = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: #63e399;
    margin: 10px 0 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
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
    transition: all 0.5s ease;

    &:hover{
        background-color: #63e399;
        color: white;
        transform: scale(1.05);
    }
`

const Extra= styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: cecnter;
    margin: 0;
`

const AddToCart = styled.p`
    font-size: 11px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #424242;
    transition: all 0.5s ease;
    z-index: 15;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
        color: #63e399;
    }
`

const StyledRating = muiStyled(Rating)({
    fontSize: 14,
    '& .MuiRating-iconFilled': {
        color: '#63e399',
    },
    '& .MuiRating-iconHover': {
        color: '#00ff6a',
    },
});

const Product = ({book}) => {

    const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)'];
    const { enqueueSnackbar } = useSnackbar();

    const [slideIndex, setSlideIndex] = useState(1);
    const dispatch = useDispatch();

    const avgRate = (book) =>{
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount)*2)/2
        return rate;
    }

    const changeSlide = (n) => {
        setSlideIndex(prev => prev + n);

        if ((slideIndex + n) > multiImages.length){
            setSlideIndex(1)
        }
        if ((slideIndex + n) < 1) {
            setSlideIndex(multiImages.length)
        }
    }

    const handleAddToCart = (book) => {
        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1,
        }))
    };

  return (
      <Container>
        <ImageSlider>
            {multiImages.map((style, index) => (
            <Image key={index} src={book.image} 
            style={{display: (index + 1) === slideIndex ? "block" : "none", transform: style}}/>
            ))}
        </ImageSlider>
        <Info>
            <Link to={`/product/${book.id}`} style={{color: 'inherit'}}>
                <Brand>{book.author}</Brand>
                <Title>{book.title}</Title>
                <Sale>{book.price.toLocaleString()}&nbsp;đ</Sale>
                <Price>
                    <p style={{textDecoration: 'line-through', marginTop: 0, marginBottom: 0}}>{Math.round(book.price * 1.1).toLocaleString()}&nbsp;đ</p>
                    <Percent>10%</Percent>
                </Price>
            </Link>
            <Divider/>
            <Extra>
                <AddToCart onClick={() => handleAddToCart(book)}><ShoppingCartIcon style={{fontSize: 14}}/>&nbsp;THÊM VÀO GIỎ</AddToCart>
                <StyledRating
                    name="product-rating"
                    value={avgRate(book)}
                    getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    precision={0.5}
                    icon={<StarIcon style={{fontSize: 16}}/>}
                    emptyIcon={<StarBorderIcon style={{fontSize: 16}}/>}
                    readOnly
                />
            </Extra>
        </Info>
        <MoreInfo>
            <Arrow direction="left" onClick={()=>changeSlide(-1)}>
                <KeyboardArrowLeft style={{fontSize: 30}}/>
            </Arrow>
            <Arrow direction="right" onClick={()=>changeSlide(1)}>
                <KeyboardArrowRight style={{fontSize: 30}}/>
            </Arrow>
        </MoreInfo>
    </Container>
  )
}

export default Product