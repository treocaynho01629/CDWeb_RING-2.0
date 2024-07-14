import styled from 'styled-components'
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CustomButton from './custom/CustomButton';

//#region styled
const Container = styled.div`
    min-width: 145px;
    max-width: 210px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    position: relative;
    border: 0.5px solid lightgray;
    overflow: hidden;
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
//#endregion

const ProductSimple = ({ book }) => {
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
            <Container>
                <Link to={`/product/${book?.id}`} style={{ color: 'inherit' }}>
                    <LazyLoadImage src={book?.image}
                        height={250}
                        width={190}
                        style={{
                            zIndex: -3,
                            marginBottom: '10px 0',
                            objectFit: 'contain',
                        }}
                    />
                    <Info>
                        <Price>{book.price.toLocaleString()}&nbsp;đ</Price>
                        <Title>{book.title}</Title>
                    </Info>
                </Link>
                <CustomButton
                    size="small"
                    variant="outlined"
                    onClick={() => handleAddToCart(book)}
                    sx={{ marginTop: '10px', marginBottom: '15px', padding: '6px 10px' }}
                >
                    <ShoppingCartIcon style={{ fontSize: 14 }} />&nbsp;THÊM VÀO GIỎ
                </CustomButton>
            </Container>
        )
    } else {
        return (
            <Container>
                <Skeleton variant="rectangular" width={190} height={240} sx={{ margin: '5px 5px 20px 5px' }} />
                <Info>
                    <Skeleton variant="text" sx={{ fontSize: '21px' }} width="60%" />
                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width="100%" />
                </Info>
                <CustomButton
                    size="small"
                    variant="outlined"
                    sx={{ marginTop: '10px', marginBottom: '15px', padding: '6px 10px' }}
                >
                    <ShoppingCartIcon style={{ fontSize: 14 }} />&nbsp;THÊM VÀO GIỎ
                </CustomButton>
            </Container>
        )
    }
}

export default ProductSimple