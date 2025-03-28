import { useDispatch, useSelector } from "react-redux";
import {
  isPersist,
  selectCurrentToken,
  selectShop,
  setShop as setCurrShop,
  setPersist as setCurrPersist,
  setAuth as setCurrAuth,
  clearAuth as clearCurrAuth,
} from "@ring/redux";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const shop = useSelector(selectShop);
  const persist = useSelector(isPersist);
  const dispatch = useDispatch();
  const setShop = (shop) => dispatch(setCurrShop(shop));
  const setPersist = (persist) => dispatch(setCurrPersist(persist));
  const setAuth = (auth) => dispatch(setCurrAuth(auth));
  const clearAuth = () => dispatch(clearCurrAuth());

  if (token) {
    //Extract data
    const decoded = jwtDecode(token);
    const { id, sub, roles, image, exp } = decoded;
    return {
      token,
      shop,
      id,
      username: sub,
      image,
      roles,
      exp,
      persist,
      setShop,
      setPersist,
      setAuth,
      clearAuth,
    };
  }

  return {
    token,
    shop,
    id: null,
    username: null,
    image: null,
    roles: null,
    exp: null,
    persist,
    setShop,
    setPersist,
    setAuth,
    clearAuth,
  };
};
export default useAuth;
