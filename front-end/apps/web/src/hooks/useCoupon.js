import { useDispatch, useSelector } from "react-redux";
import {
  addCoupon as addNewCoupon,
  removeCoupon as removeStateCoupon,
  selectCoupons,
} from "../features/coupons/couponReducer";

const useCoupon = () => {
  const dispatch = useDispatch();
  const coupons = useSelector(selectCoupons);

  //Coupon
  const addCoupon = (code) => {
    dispatch(addNewCoupon(code));
  };
  const removeCoupon = (code) => dispatch(removeStateCoupon(code));

  return { coupons, addCoupon, removeCoupon };
};

export default useCoupon;
