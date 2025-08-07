import { useDispatch, useSelector } from "react-redux";
import {
  selectEnums,
  importEnums as importStateEnums,
  resetEnums,
} from "../features/enums/enumReducer";
import { EnumResponse } from "../features/enums/enumsApiSlice";

const useEnums = () => {
  const dispatch = useDispatch();
  const enums = useSelector(selectEnums);
  const importEnums = (data: EnumResponse[]) =>
    dispatch(importStateEnums(data));
  const clearEnums = () => dispatch(resetEnums());

  return {
    enums,
    importEnums,
    clearEnums,
  };
};

export default useEnums;
