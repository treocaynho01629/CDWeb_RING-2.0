import { useDispatch, useSelector } from 'react-redux';
import { addAddress, addToCart, changeQuantity, decreaseQuantity, increaseQuantity, 
    removeItem, resetCart, selectAddresses, selectCartProducts, removeStateAddress, 
    replaceInCart, removeShopItem
} from '../features/cart/cartReducer';

const useCart = () => {
    const dispatch = useDispatch();
    const cartProducts = useSelector(selectCartProducts);
    const addresses = useSelector(selectAddresses);

    //Cart
    const addProduct = async (item, quantity) => {
        const { enqueueSnackbar } = await import('notistack');
        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: item.id,
            slug: item.slug,
            title: item.title,
            price: item.price,
            discount: item.discount,
            image: item.image,
            amount: item.amount,
            shopId: item.shopId,
            shopName: item.shopName,
            quantity,
        }));
    }
    const replaceProduct = (item) => {
        dispatch(replaceInCart({
            id: item.id,
            slug: item.slug,
            title: item.title,
            price: item.price,
            discount: item.discount,
            amount: item.amount,
            shopId: item.shopId,
            shopName: item.shopName,
        }));
    }
    const increaseAmount = (id) => dispatch(increaseQuantity(id));
    const decreaseAmount = (id) => dispatch(decreaseQuantity(id));
    const changeAmount = ({ id, quantity }) => dispatch(changeQuantity({ id, quantity }));
    const removeProduct = (id) => dispatch(removeItem(id));
    const removeShopProduct = (id) => dispatch(removeShopItem(id));
    const clearCart = () => dispatch(resetCart());

    //Address
    const addNewAddress = (address) => {dispatch(addAddress(address))}
    const removeAddress = (id) => dispatch(removeStateAddress(id));

    return { cartProducts, addresses, addProduct, replaceProduct, decreaseAmount, increaseAmount, 
        changeAmount, removeProduct, removeShopProduct, clearCart, addNewAddress, removeAddress }
}

export default useCart