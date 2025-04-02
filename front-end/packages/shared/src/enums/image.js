import { store } from "@ring/redux";

export const getImageSize = () => {
  const enums = store?.getState()?.enum?.enums;

  return (
    enums?.["ImageSize"]?.enums ??
    Object.freeze({
      TINY: { value: "TINY", width: 65 },
      SMALL: { value: "SMALL", width: 180 },
      MEDIUM: { value: "MEDIUM", width: 405 },
    })
  );
};
