import { useEffect } from "react";
import { enumsApiSlice } from "@ring/redux/enumsApiSlice";
import useEnums from "@ring/redux/useEnums";

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
    syncEnums();
  }, []);
};

export default useGetEnums;
