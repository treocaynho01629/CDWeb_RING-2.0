import { useDispatch, useSelector } from "react-redux";
import {
  selectKeywords,
  addKeyword as addStatekeyword,
  removeKeyword as removeStateKeyword,
} from "../features/app/appReducer";

const useApp = () => {
  const dispatch = useDispatch();
  const keywords = useSelector(selectKeywords);

  const addKeyword = (keyword) => {
    dispatch(addStatekeyword(keyword));
  };
  const removeKeyword = (keyword) => dispatch(removeStateKeyword(keyword));

  return {
    keywords,
    addKeyword,
    removeKeyword,
  };
};

export default useApp;
