import { getStore } from "@ring/redux/storeRef";

export const getGenderType = () => {
  return Object.freeze({
    "": { value: "", label: "Không" },
    MALE: { value: "MALE", label: "Nam" },
    FEMALE: { value: "FEMALE", label: "Nữ" },
  });
};

export const getUserRole = () => {
  const store = getStore();
  const enums = store?.getState()?.enum?.enums;

  return (
    enums?.["UserRole"]?.enums ??
    Object.freeze({
      ROLE_USER: {
        color: "default",
        label: "Thành viên",
        value: "ROLE_USER",
      },
      ROLE_SELLER: {
        color: "info",
        label: "Người bán",
        value: "ROLE_SELLER",
      },
      ROLE_ADMIN: {
        color: "primary",
        label: "Quản trị viên",
        value: "ROLE_ADMIN",
      },
      ROLE_GUEST: {
        color: "warning",
        label: "Khách",
        value: "ROLE_GUEST",
      },
    })
  );
};
