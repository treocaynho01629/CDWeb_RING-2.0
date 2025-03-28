import { isEqual } from "lodash-es";
import useCart from "./useCart";

const tempShippingFee = 10000;

const useCheckout = () => {
  const { cartProducts, replaceProduct, removeProduct, removeShopProduct } =
    useCart();

  const estimateCart = (cart) => {
    let estimated = { deal: 0, subTotal: 0, shipping: 0, total: 0 }; //Initial value
    let checkState = { value: 0, quantity: 0, details: [] };
    let cartDetails = {};

    if (cart?.cart?.length) {
      let totalDeal = 0;
      let subTotal = 0;
      let totalQuantity = 0;
      const shipping = tempShippingFee * (cart?.cart?.length || 0);

      //Loop & calculate
      cart?.cart?.forEach((detail) => {
        let deal = 0;
        let productTotal = 0;
        let quantity = 0;

        detail?.items?.forEach((item) => {
          const discount = Math.round(item.price * item.discount);

          //Both deal & total price
          deal += item.quantity * discount;
          productTotal += item.quantity * item.price;
          quantity += item.quantity;
        });

        //Set value & cart state
        totalDeal += deal;
        subTotal += productTotal;
        totalQuantity += quantity;
        cartDetails[detail?.shopId] = { value: productTotal - deal, quantity };
      });

      //Set values
      estimated = {
        deal: totalDeal,
        subTotal,
        shipping,
        total: subTotal + shipping - totalDeal,
      };

      //Set cart state
      checkState = {
        value: subTotal - totalDeal,
        quantity: totalQuantity,
        details: cartDetails,
      };
    }

    return { checkState, estimated };
  };

  const syncCart = (
    cart,
    setDiscount,
    setShopDiscount,
    coupon,
    setCoupon,
    shopCoupon,
    setShopCoupon
  ) => {
    if (!cartProducts?.length) return;
    const details = cart?.details;

    details.forEach((detail, index) => {
      if (detail.shopName != null) {
        //Replace all items from that shop
        const items = detail?.items;

        items.forEach((item, index) => {
          if (item.title != null) {
            //Replace old item in cart
            const newItem = {
              ...item,
              shopId: detail.shopId,
              shopName: detail.shopName,
            };

            replaceProduct(newItem);
          } else {
            //Remove invalid item
            handleClearSelect();
            removeProduct(item.id);
          }
        });

        //Replace recommended coupons
        const discountValue = detail?.couponDiscount + detail?.shippingDiscount;
        setShopDiscount((prev) => ({
          ...prev,
          [detail?.shopId]: discountValue,
        }));
        if (
          detail?.coupon != null &&
          shopCoupon[detail?.shopId] !== null &&
          !isEqual(shopCoupon[detail?.shopId], detail.coupon)
        ) {
          setShopCoupon((prev) => ({
            ...prev,
            [detail?.shopId]: detail.coupon,
          }));
        }
      } else {
        //Remove all items of the invalid Shop
        handleClearSelect();
        removeShopProduct(detail.shopId);
      }
    });

    //Replace recommend coupon
    const discountValue = cart?.couponDiscount + cart?.shippingDiscount;
    setDiscount(discountValue);
    if (
      cart?.coupon != null &&
      coupon !== null &&
      !isEqual(coupon !== cart.coupon)
    ) {
      setCoupon(cart.coupon);
    }
  };

  return { estimateCart, syncCart };
};

export default useCheckout;
