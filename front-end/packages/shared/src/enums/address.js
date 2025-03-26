export const getAddressType = () => {
  return Object.freeze({
    HOME: { value: "HOME", label: "Nhà riêng", color: "primary" },
    OFFICE: { value: "OFFICE", label: "Văn phòng", color: "info" },
  });
};
