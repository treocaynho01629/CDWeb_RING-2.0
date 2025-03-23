import { enumsApiSlice, useEnums } from "@ring/redux";
import { useEffect } from "react";

const useGetEnums = () => {
  const { enums, importEnums } = useEnums();
  const [getEnums, { isLoading }] = enumsApiSlice.useLazyGetEnumsQuery();

  const syncEnums = async () => {
    if (enums != null) return;

    getEnums()
      .unwrap()
      .then((data) => {
        importEnums(data);
      })
      .catch((rejected) => console.error(rejected));
  };

  useEffect(() => {
    return () => syncEnums();
  }, []);
};

export default useGetEnums;
