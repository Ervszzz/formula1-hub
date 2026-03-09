import { useState, useCallback, useEffect, useRef } from "react";

export const useFetchData = <T>(
  fetchFn: () => Promise<T | null>,
  validate?: (data: T) => boolean
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use refs so `load` stays stable while always calling the latest fetchFn/validate
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;
  const validateRef = useRef(validate);
  validateRef.current = validate;

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const result = await fetchRef.current();
      if (result === null) {
        setError("No Data Fetched");
        setData(null);
      } else if (!validateRef.current || validateRef.current(result)) {
        setData(result);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError("Invalid data format received");
        setData(null);
      }
    } catch {
      setError("Failed to load data");
      setData(null);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refreshing, lastUpdated, refresh: () => load(true) };
};
