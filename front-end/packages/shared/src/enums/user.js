import { store } from "@ring/redux";

export const getGenderType = () => {
  return Object.freeze({
    "": { value: "", label: "Không" },
    MALE: { value: "MALE", label: "Nam" },
    FEMALE: { value: "FEMALE", label: "Nữ" },
  });
};

export const getUserRole = () => {
  const enums = store?.getState()?.enum?.enums;

  return (
    enums?.["UserRole"]?.enums ??
    Object.freeze({
      ROLE_USER: { label: "Thành viên", color: "default" },
      ROLE_SELLER: { label: "Nhân viên", color: "info" },
      ROLE_ADMIN: { label: "Admin", color: "primary" },
      ROLE_GUEST: { label: "Khách", color: "warning" },
    })
  );
};
