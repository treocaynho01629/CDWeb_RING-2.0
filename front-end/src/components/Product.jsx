import { useState } from 'react'

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system'

import { KeyboardArrowRight, KeyboardArrowLeft, Star as StarIcon, StarBorder as StarBorderIcon, ShoppingCart as ShoppingCartIcon} from '@mui/icons-material';
import { Divider, Rating } from '@mui/material'

import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

//#region styled
const MoreInfo = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
    z-index: 3;
    display: flex;
    justify-content: end;
    align-items: center;
    transition: all 0.5s ease;
`

const ImageSlider = styled.div`
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 2px 2px 0px 2px;
    margin: 2px 2px 0px 2px;
    transition: all 0.25s ease;
    z-Index: -1;
`

const Container = styled.div`
    min-width: 172px;
    max-width: 290px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border: 0.5px solid lightgray;
    overflow: hidden;
    transition: all 0.5s ease;

    &:hover ${MoreInfo}{
        opacity: 1;
    };

    &:hover ${ImageSlider}{
        padding: 0;
    };

    &:hover {
        border-color: gray;
    }

    @media (min-width: 1000px) {
        min-width: 220px;
    }
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    margin-top: -20px;
    width: 92%;
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
    cursor: pointer;
    z-index: 5;

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
    text-align: center;
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

    &:after {
        content: "  THÊM VÀO GIỎ";
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
//#endregion
const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)'];

const Product = ({book}) => {
    const [slideIndex, setSlideIndex] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const avgRate = () =>{
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount)*2)/2
        return rate;
    }

    const changeSlide = (event, n) => {
        event.stopPropagation();
        setSlideIndex(prev => prev + n);

        if ((slideIndex + n) > multiImages.length){
            setSlideIndex(1)
        }
        if ((slideIndex + n) < 1) {
            setSlideIndex(multiImages.length)
        }
    }

    const handleAddToCart = async (book) => {
        const { addToCart } = await import('../redux/cartReducer');
        const { enqueueSnackbar } = await import('notistack');

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
            <>
            <LazyLoadImage key={index + ":" + book.id}
                src={book.image}
                height={220}
                width={'85%'}
                style={{
                    zIndex: -1,
                    transition: 'all 0.5s ease',
                    margin: '5px 0px 10px 0px',
                    objectFit: 'contain',
                    display: (index + 1) === slideIndex ? "block" : "none", 
                    transform: style,
                }}
            />
            </>
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
                <AddToCart onClick={() => handleAddToCart(book)}><ShoppingCartIcon style={{fontSize: 14}}/>&nbsp;</AddToCart>
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
        <MoreInfo onClick={() => navigate(`/product/${book.id}`)}>
            <Arrow direction="left" onClick={(e)=>changeSlide(e, -1)}>
                <KeyboardArrowLeft style={{fontSize: 30}}/>
            </Arrow>
            <Arrow direction="right" onClick={(e)=>changeSlide(e, 1)}>
                <KeyboardArrowRight style={{fontSize: 30}}/>
            </Arrow>
        </MoreInfo>
    </Container>
  )
}

export default Product