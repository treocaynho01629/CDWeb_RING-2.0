import styled from 'styled-components'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useSnackbar } from 'notistack';

import { Link } from "react-router-dom"
import { addToCart } from '../redux/cartReducer';
import { useDispatch } from 'react-redux';

const Image = styled.img`
    height: 250px;
    width: 190px;
    z-index: -1;
    transition: all 0.5s ease;
    margin: 10px 0;
    object-fit: contain;
`

const Container = styled.div`
    min-width: 210px;
    max-width: 210px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    position: relative;
    border: 0.5px solid lightgray;
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -15px;
    padding: 0 5px;
    width: 90%;
    z-index: 4;
`

const Title = styled.h5`
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const Price = styled.span`
    font-size: 21px;
    font-weight: bold;
    color: #63e399;
    margin: 10px 0 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const AddToCart = styled.p`
    font-size: 11px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: inherit;
    background-color: #f3f3f3;
    transition: all 0.5s ease;
    z-index: 15;
    margin-bottom: 10px;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
        color: white;
        background-color: #63e399;
    }
`

const ProductSimple = ({book}) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();

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
        <Link to={`/product/${book.id}`} style={{color: 'inherit'}}>
            <Image src={book.image}/>
            <Info>
                <Price>{book.price.toLocaleString()}&nbsp;đ</Price>
                <Title>{book.title}</Title>
            </Info>
        </Link>
        <AddToCart onClick={() => handleAddToCart(book)}><ShoppingCartIcon style={{fontSize: 14}}/>&nbsp;THÊM VÀO GIỎ</AddToCart>
    </Container>
  )
}

export default ProductSimple