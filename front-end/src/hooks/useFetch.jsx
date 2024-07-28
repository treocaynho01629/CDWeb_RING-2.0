import { useEffect, useState } from "react";
import axios from "../app/api/axios"

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch (err) {
        setError(true);
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [url]);

  const refetch = () => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch (err) {
        setError(true);
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    }
  };

  return { data, loading, error, refetch };
}

export default useFetch;