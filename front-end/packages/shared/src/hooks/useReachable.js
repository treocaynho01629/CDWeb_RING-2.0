import { useEffect } from "react";

const useReachable = () => {
  //Fire a snack notification if it take too long to reach the server
  const connect = async () => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, "Request timed out"); //5s
    });
    const request = fetch(import.meta.env.VITE_API_URL + "/api/v1/ping");
    return Promise.race([timeout, request])
      .then(async (response) => {
        console.log("Connected");
      })
      .catch(async (error) => {
        const { enqueueSnackbar } = await import("notistack");
        enqueueSnackbar("Mất kết nối với Server!", {
          variant: "warning",
          persist: true,
          preventDuplicate: true,
        });
      });
  };

  useEffect(() => {
    return () => connect();
  }, []);
};

export default useReachable;
