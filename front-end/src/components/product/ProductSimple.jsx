import styled from 'styled-components'
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCart from '../../hooks/useCart';

//#region styled
const Container = styled.div`
    min-width: 145px;
    max-width: 290px;
    height: 100%;
    width: 100%;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: .5px solid ${props => props.theme.palette.action.hover};
    margin-left: ${props => props.theme.spacing(.1)};
    margin-right: ${props => props.theme.spacing(.1)};

    &:hover {
        border-color: ${props => props.theme.palette.action.focus};
        box-shadow: ${props => props.theme.shadows[1]};
    }
`

const Info = styled.div`
    width: 100%;
    z-index: 4;
`

const Title = styled.h5`
    width: 100%;
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
    font-weight: 400;
    color: ${props => props.theme.palette.primary.main};
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
    }
`

const Percentage = styled.span`
    padding: 1px 5px;
    margin-left: 10px;
    font-size: 14px;
    color: ${props => props.theme.palette.text.primary};
    background-color: ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 5px;
        font-size: 10px;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    z-index: -3;
    object-fit: contain;
    margin: 5px 0;

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 0;
    }
`
//#endregion

const ProductSimple = ({ book, scrollPosition }) => {
    const { addProduct } = useCart();

    const handleAddToCart = (book) => { addProduct(book, 1) };

    return (
        <Container>
            {book
                ?
                <Link to={`/product/${book?.id}`} style={{ width: '100%' }}>
                    <StyledLazyImage
                        src={`${book?.image}?size=small`}
                        alt={`${book?.title} Thumbnail`}
                        width={'100%'}
                        height={180}
                        scrollPosition={scrollPosition}
                        placeholder={
                            <div>
                                <Skeleton
                                    variant="rectangular"
                                    height={180}
                                    sx={{ aspectRatio: '1/1' }}
                                />
                            </div>
                        }
                    />
                    <Info>
                        <Price>{book.price.toLocaleString()}đ
                            {book.onSale > 0 && <Percentage>-{book.onSale * 100}%</Percentage>}
                        </Price>
                        <Title>{book.title}</Title>
                    </Info>
                </Link>
                :
                <>
                    <div>
                        <Skeleton
                            variant="rectangular"
                            height={180}
                            sx={{ aspectRatio: '1/1' }}
                        />
                    </div>
                    <Info>
                        <Skeleton variant="text" sx={{ fontSize: '20px' }} width="60%" />
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="100%" />
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="50%" />
                    </Info>
                </>
            }
            <Button
                disabled={!book}
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => handleAddToCart(book)}
                sx={{ marginBottom: '10px', marginTop: '10px', padding: '6px 0', width: '93%' }}
                startIcon={<ShoppingCartIcon />}
            >
                THÊM VÀO GIỎ
            </Button>
        </Container>
    )
}

export default ProductSimple