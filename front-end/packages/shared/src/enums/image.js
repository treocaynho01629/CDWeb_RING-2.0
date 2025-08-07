import { getStore } from "@ring/redux/storeRef";

export const getImageSize = () => {
  const store = getStore();
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
