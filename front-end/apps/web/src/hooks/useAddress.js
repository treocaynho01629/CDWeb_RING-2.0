import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  removeStateAddress,
  selectAddresses,
} from "../features/addresses/addressReducer";

const useAddress = () => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);

  //Address
  const addNewAddress = (address) => {
    dispatch(addAddress(address));
  };
  const removeAddress = (id) => dispatch(removeStateAddress(id));

  return { addresses, addNewAddress, removeAddress };
};

export default useAddress;
