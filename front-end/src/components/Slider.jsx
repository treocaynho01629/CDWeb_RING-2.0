import { useState, useEffect } from "react"

import styled from "styled-components"
import Carousel from 'react-material-ui-carousel'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton';

import { Link } from "react-router-dom"
import { addToCart } from '../redux/cartReducer';
import { useDispatch } from "react-redux"
import useFetch from '../hooks/useFetch'
import { useSnackbar } from 'notistack';

const ImgContainer = styled.div`
    height: 450px;
    text-align: center;
    justify-content: center;
    align-items: center;
`

const Image = styled.img`
    height: 400px;
    object-fit: contain;
`

const InfoContainer = styled.div`
    padding: 40px 50px;
    align-items: center;
    justify-content: center;
`

const Title = styled.h2`
    font-size: 30px;
    line-height: normal;
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

const Description = styled.p`
    margin: 30px 0px;
    font-size: 18px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
`

const Button = styled.button`
    background-color: #63e399;
    padding: 10px 20px;;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    transition: all 0.5s ease;
    z-index: 5;

    &:hover {
        background-color: lightgray;
        color: black;
    };

    &:focus {
        outline: none;
        border: none;
        border: 0;
    };

    outline: none;
    border: 0;
`

const RANDOMBOOKS_URL = 'api/books/random';

function Item({book})
{
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

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
        <Paper>
            <Grid container sx={{alignItems: 'center'}}>
                <Grid item xs={12} sm={12} md={5}>
                    <Link to={`/product/${book.id}`}>
                        <ImgContainer>
                            <Image src={book.image}/>
                        </ImgContainer>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={12} md={7}>
                    <InfoContainer>
                        <Link to={`/product/${book.id}`} style={{color: 'inherit'}}>
                            <Title>{book.title}</Title>
                            <Description>{book.description}</Description>
                        </Link>
                        <Button onClick={() => handleAddToCart(book)}>Mua ngay</Button>
                    </InfoContainer>
                </Grid>
            </Grid>
        </Paper>
    )
}

const Slider = () => {
    const [booskList, setBooksList] = useState([])
    const { loading, error, data } = useFetch(RANDOMBOOKS_URL);

    //Load
    useEffect(()=>{
        loadBooks();
    }, [loading == false]);

    const loadBooks = async()=>{
        setBooksList(data);
    };

    let skeleton = 
    <Paper>
        <Grid container sx={{alignItems: 'center'}}>
            <Grid item xs={12} sm={12} md={5}>
                <ImgContainer>
                    <Skeleton variant="rectangular" width={400} height={400} />
                </ImgContainer>
            </Grid>
            <Grid item xs={12} sm={12} md={7}>
                <InfoContainer>
                    <Skeleton variant="text" sx={{ fontSize: '30px' }}/>
                    <Skeleton variant="text" sx={{ fontSize: '18px' }}/>
                    <Skeleton variant="rectangular" width={109} height={39} />
                </InfoContainer>
            </Grid>
        </Grid>
    </Paper>
    

  return (
    <Carousel animation="slide" duration="700"
    sx={{
        marginBottom: '20px'
    }}
    navButtonsProps={{       
        style: {
            backgroundColor: '#63e399',
            borderRadius: 0,
            outline: 'none',
            border: 0,

            '&:focus':{
                outline: 'none',
            },
        }
    }} 
    activeIndicatorIconButtonProps={{
        style: {
            color: '#63e399'
        }
    }}
    indicatorContainerProps={{
        style: {
            marginTop: '-50px',
        }

    }}>
        {loading ? 
            <div>
                {skeleton}
            </div>
        : booskList?.map((book, index) => <Item key={index} book={book} /> )
        }
    </Carousel>
  )
}

export default Slider