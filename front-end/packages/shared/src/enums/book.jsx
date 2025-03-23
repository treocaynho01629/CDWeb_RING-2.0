import { store } from "@ring/redux";

export const BookLanguage =
  store.getState().enum?.enums["  "]?.enums ??
  Object.freeze({
    VI: { value: "", label: "Không" },
    EN: { value: "MALE", label: "Nam" },
    FEMALE: { value: "FEMALE", label: "Nữ" },
  });
