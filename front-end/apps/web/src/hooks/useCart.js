import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  changeQuantity,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  resetCart,
  selectCartProducts,
  replaceInCart,
  removeShopItem,
} from "../features/cart/cartReducer";

const useCart = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector(selectCartProducts);

  //Cart
  const addProduct = async (item, quantity) => {
    const { enqueueSnackbar } = await import("notistack");
    enqueueSnackbar("Đã thêm sản phẩm vào giỏ hàng!", { variant: "success" });
    dispatch(
      addToCart({
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
      }),
    );
  };
  const replaceProduct = (item) => {
    dispatch(
      replaceInCart({
        id: item.id,
        slug: item.slug,
        title: item.title,
        price: item.price,
        discount: item.discount,
        amount: item.amount,
        shopId: item.shopId,
        shopName: item.shopName,
      }),
    );
  };
  const increaseAmount = (id) => dispatch(increaseQuantity(id));
  const decreaseAmount = (id) => dispatch(decreaseQuantity(id));
  const changeAmount = ({ id, quantity }) =>
    dispatch(changeQuantity({ id, quantity }));
  const removeProduct = (id) => dispatch(removeItem(id));
  const removeShopProduct = (id) => dispatch(removeShopItem(id));
  const clearCart = () => dispatch(resetCart());

  return {
    cartProducts,
    addProduct,
    replaceProduct,
    decreaseAmount,
    increaseAmount,
    changeAmount,
    removeProduct,
    removeShopProduct,
    clearCart,
  };
};

export default useCart;
