import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const usePrivateFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch (err) {
        setError(true);
        navigate('/login', { state: { from: location }, replace: true });
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
        const res = await axiosPrivate.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch (err) {
        setError(true);
        navigate('/login', { state: { from: location }, replace: true });
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
};

export default usePrivateFetch;