import { useDispatch, useSelector } from "react-redux";
import {
  selectKeywords,
  addKeyword as addStatekeyword,
  removeKeyword as removeStateKeyword,
  resetKeywords,
} from "../features/app/appReducer";

const useApp = () => {
  const dispatch = useDispatch();
  const keywords = useSelector(selectKeywords);

  const addKeyword = (keyword) => {
    dispatch(addStatekeyword(keyword));
  };
  const removeKeyword = (keyword) => dispatch(removeStateKeyword(keyword));
  const clearKeywords = () => dispatch(resetKeywords());

  return {
    keywords,
    addKeyword,
    removeKeyword,
    clearKeywords,
  };
};

export default useApp;
