import styled from "styled-components"
import { useState, useEffect } from "react"
import { Paper, Grid, Skeleton } from '@mui/material';
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Carousel from 'react-material-ui-carousel'
import CustomButton from "./custom/CustomButton";
import useFetch from '../hooks/useFetch'

//#region styled
const ImgContainer = styled.div`
    height: 450px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
`

const InfoContainer = styled.div`
    padding: 40px 50px;
    align-items: center;
    justify-content: center;
`

const Title = styled.h2`
    min-height: 74px;
    font-size: 30px;
    margin: 0;
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

    @media (min-width: 900px) {
        margin: 25px 0px;
        min-width: auto;
    }
`

const Description = styled.p`
    min-height: 72px;
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

    @media (min-width: 900px) {
        min-width: auto;
    }
`
//#endregion

const RANDOMBOOKS_URL = 'api/books/random';

function Item({ book }) {
    const dispatch = useDispatch();

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

    if (book) {
        return (
            <Paper sx={{ minHeight: '515px', maxHeight: '800px' }}>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs={12} md={5}>
                        <Link to={`/product/${book.id}`}>
                            <ImgContainer>
                                <LazyLoadImage src={book.image}
                                    height={400}
                                    width={400}
                                    style={{
                                        objectFit: 'contain',
                                        minHeight: '400px'
                                    }}
                                />
                            </ImgContainer>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <InfoContainer>
                            <Link to={`/product/${book.id}`} style={{ color: 'inherit' }}>
                                <Title>{book.title}</Title>
                                <Description>{book.description}</Description>
                            </Link>
                            <CustomButton
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={() => handleAddToCart(book)}
                            >
                                Mua ngay
                            </CustomButton>
                        </InfoContainer>
                    </Grid>
                </Grid>
            </Paper>
        )
    } else {
        return (
            <Paper sx={{ minHeight: '515px', maxHeight: '800px' }}>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs={12} sm={12} md={5}>
                        <ImgContainer>
                            <Skeleton variant="rectangular" width={400} height={400} sx={{width: '400px'}}/>
                        </ImgContainer>
                    </Grid>
                    <Grid item xs={12} sm={12} md={7}>
                        <InfoContainer>
                            <Skeleton variant="text" sx={{ fontSize: '30px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '30px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                            <Skeleton variant="rectangular" width={109} height={39} />
                        </InfoContainer>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

const Slider = () => {
    const [booksList, setBooksList] = useState([])
    const { loading, data } = useFetch(RANDOMBOOKS_URL);

    //Load
    useEffect(() => {
        loadBooks();
    }, [loading == false]);

    const loadBooks = async () => {
        setBooksList(data);
    };

    return (
        <Carousel animation="slide" duration="700" interval={15000}
            sx={{
                marginBottom: '20px'
            }}
            navButtonsProps={{
                style: {
                    backgroundColor: '#63e399',
                    borderRadius: 0,
                    outline: 'none',
                    border: 0,

                    '&:focus': {
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
            {
                (loading || !booksList?.length ? Array.from(new Array(2)) : booksList)?.map((book, index) => <Item key={`${book?.id}-${index}`} book={book} />)
            }
        </Carousel>
    )
}

export default Slider