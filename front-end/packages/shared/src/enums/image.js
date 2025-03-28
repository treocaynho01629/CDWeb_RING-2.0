import { store } from "@ring/redux";

export const getImageSize = () => {
  const enums = store?.getState()?.enum?.enums;

  return (
    enums?.["ImageSize"]?.enums ??
    Object.freeze({
      TINY: { value: "TINY", size: 65 },
      SMALL: { value: "SMALL", size: 180 },
      MEDIUM: { value: "MEDIUM", size: 405 },
    })
  );
};
