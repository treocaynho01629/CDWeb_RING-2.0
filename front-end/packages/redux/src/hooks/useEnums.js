import { useDispatch, useSelector } from "react-redux";
import {
  selectEnums,
  importEnums as importStateEnums,
  resetEnums,
} from "../features/enum/enumReducer";

const useEnums = () => {
  const dispatch = useDispatch();
  const enums = useSelector(selectEnums);
  const importEnums = (data) => dispatch(importStateEnums(data));
  const clearEnums = () => dispatch(resetEnums());

  return {
    enums,
    importEnums,
    clearEnums,
  };
};

export default useEnums;
