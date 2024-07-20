import { useDispatch, useSelector } from 'react-redux';
import { addToCart, changeQuantity, decreaseQuantity, increaseQuantity, removeItem, resetCart, selectCartProducts } from '../redux/cartReducer';

const useCart = () => {
    const dispatch = useDispatch();
    const cartProducts = useSelector(selectCartProducts);

    const addProduct = async (product) => {
        const { enqueueSnackbar } = await import('notistack');
        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart(product));
    }
    const increaseAmount = (id) => dispatch(increaseQuantity(id));
    const decreaseAmount = (id) => dispatch(decreaseQuantity(id));
    const changeAmount = ({ id, quantity }) => dispatch(changeQuantity({ id, quantity }));
    const removeProduct = (id) => dispatch(removeItem(id));
    const clearCart = async () => {
        const { enqueueSnackbar } = await import('notistack');
        enqueueSnackbar('Đã làm mới giỏ hàng!', { variant: 'error' });
        dispatch(resetCart());
    }

    return { cartProducts, addProduct, decreaseAmount, increaseAmount, changeAmount, removeProduct, clearCart }
}

export default useCart