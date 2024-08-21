import styled, { keyframes } from 'styled-components'
import { useMemo, useState } from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft, Star as StarIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Divider, Box, Tooltip, Skeleton } from '@mui/material'
import { Link, useNavigate } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useCart from '../../hooks/useCart';

//#region styled
const fadeIn = keyframes`
  from { opacity: 0}
  to { opacity: 1 }
`

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
    transition: all .25s ease;
`

const ImageSlider = styled.div`
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 2px 2px 0px 2px;
    margin: 2px 2px 0px 2px;
    transition: all .25s ease;
    z-Index: 1;
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
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    overflow: hidden;
    transition: all .25s ease;

    &:hover ${MoreInfo}{
        opacity: 1;
    };

    &:hover ${ImageSlider}{
        transform: scale(1.025);
    };

    &:hover {
        border-color: ${props => props.theme.palette.action.hover};
    }

    @media (min-width: 1000px) {
        min-width: 220px;
    }
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 3px;
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
    line-height: 2;
    font-size: 14px;
    margin: 0;
    margin-top: 5px;
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
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    margin: 0;
    margin-bottom: 5px;
`

const Percent = styled.p`
    color: ${props => props.theme.palette.primary.main};
    margin: 0 0 0 10px;
`

const Sale = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.palette.primary.main};
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const Arrow = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.theme.palette.action.hover};
    color: ${props => props.theme.palette.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    opacity: 0.75;
    transition: all .25s ease;
    cursor: pointer;
    z-index: 5;

    &:hover{
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.primary.contrastText};
        transform: scale(1.05);
    }
`

const Extra = styled.div`
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
    transition: all .25s ease;
    z-index: 15;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.palette.primary.main};
    }

    &:after {
        content: "  THÊM VÀO GIỎ";
    }
`

const TextRating = styled.b`
    margin-right: 5px;
    font-size: 12px;
`

const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    margin: 10px 2px;
    object-fit: contain;
    transform: ${props => props.imageStyle};
    animation: ${fadeIn} .25s ease;
    z-index: -1;
`
//#endregion
const multiImages = ['scaleX(1)', 'scaleX(-1) scaleY(-1)', 'scaleX(-1)', 'scaleY(-1)'];

const Product = ({ book, scrollPosition }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const { addProduct } = useCart();
    const navigate = useNavigate();

    const avgRate = () => {
        let rate = 0;
        rate = Math.round((book?.rateTotal / book?.rateAmount) * 2) / 2
        rate = rate ? rate : '~';
        return rate;
    }

    const calculatedRate = useMemo(() => avgRate(), [book]);

    const changeSlide = (event, n) => {
        event.stopPropagation();
        setSlideIndex(prev => prev + n);

        if ((slideIndex + n) > multiImages.length) {
            setSlideIndex(1)
        }
        if ((slideIndex + n) < 1) {
            setSlideIndex(multiImages.length)
        }
    }

    const handleAddToCart = (book) => {
        addProduct({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1,
        })
    };

    return (
        <Container>
            <ImageSlider>
                {book
                    ?
                    <StyledLazyImage
                        key={`${book?.id}-${multiImages[slideIndex]}`}
                        src={`${book?.image}?size=small`}
                        alt={`${book?.title} Thumbnail`}
                        width={'100%'}
                        height={220}
                        imageStyle={multiImages[slideIndex]}
                        scrollPosition={scrollPosition}
                        placeholder={
                            <Skeleton
                                variant="rectangular"
                                width={'90%'}
                                height={210}
                                animation={false}
                                sx={{
                                    aspectRatio: '1/1',
                                    margin: '5px 0px 20px 0px',
                                    width: '90%'
                                }}
                            />
                        }
                    />
                    :
                    <Skeleton
                        variant="rectangular"
                        width={'90%'}
                        height={210}
                        sx={{
                            aspectRatio: '1/1.1',
                            margin: '5px 0px 20px 0px',
                            width: '90%'
                        }}
                    />
                }

            </ImageSlider>
            <Info>
                {book
                    ?
                    <Link to={`/product/${book.id}`} style={{ color: 'inherit' }}>
                        <Brand>{book.author}</Brand>
                        <Title>{book.title}</Title>
                        <Sale>{book.price.toLocaleString()}&nbsp;đ</Sale>
                        <Price>
                            <p style={{ textDecoration: 'line-through', marginTop: 0, marginBottom: 0 }}>{Math.round(book.price * 1.1).toLocaleString()}&nbsp;đ</p>
                            <Percent>10%</Percent>
                        </Price>
                    </Link>
                    :
                    <>
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} />
                        <Skeleton variant="text" sx={{ fontSize: '14px' }} width="60%" />
                        <Skeleton variant="text" sx={{ fontSize: '20px' }} width="40%" />
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="50%" />
                    </>
                }
                <Divider />
                <Extra>
                    <AddToCart onClick={() => handleAddToCart(book)} disabled={!book}>
                        <ShoppingCartIcon style={{ fontSize: 14 }} />&nbsp;
                    </AddToCart>
                    <Tooltip
                        sx={{ display: 'flex', alignItems: 'center' }}
                        title={calculatedRate === '~' ? 'Chưa có đánh giá nào' : `Trên tổng ${book.rateAmount} đánh giá`}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TextRating>{calculatedRate}</TextRating>
                            <StarIcon sx={{
                                fontSize: 16,
                                color: 'primary.main',
                            }}
                            />
                        </Box>
                    </Tooltip>
                </Extra>
            </Info>
            {book &&
                <MoreInfo onClick={() => navigate(`/product/${book.id}`)}>
                    <Arrow direction="left" onClick={(e) => changeSlide(e, -1)}>
                        <KeyboardArrowLeft style={{ fontSize: 30 }} />
                    </Arrow>
                    <Arrow direction="right" onClick={(e) => changeSlide(e, 1)}>
                        <KeyboardArrowRight style={{ fontSize: 30 }} />
                    </Arrow>
                </MoreInfo>
            }
        </Container>
    )
}

export default Product