export const genderType = ["MALE", "FEMALE"];

export const genderTypes = {
  "": "Không",
  MALE: "Nam",
  FEMALE: "Nữ",
};

export const genderTypeItems = [
  {
    value: "",
    label: "Không",
  },
  {
    value: "MALE",
    label: "Nam",
  },
  {
    value: "FEMALE",
    label: "Nữ",
  },
];

export const roleType = [
  "ROLE_USER",
  "ROLE_SELLER",
  "ROLE_ADMIN",
  "ROLE_GUEST",
];

export const roleTypes = {
  ROLE_USER: { label: "Thành viên", color: "default" },
  ROLE_SELLER: { label: "Nhân viên", color: "info" },
  ROLE_ADMIN: { label: "Admin", color: "primary" },
  ROLE_GUEST: { label: "Khách", color: "warning" },
};

export const roleTypeItems = [
  {
    value: "ROLE_USER",
    label: "Thành viên",
  },
  {
    value: "ROLE_SELLER",
    label: "Nhân viên",
  },
  {
    value: "ROLE_ADMIN",
    label: "Admin",
  },
  {
    value: "ROLE_GUEST",
    label: "Khách",
  },
];
