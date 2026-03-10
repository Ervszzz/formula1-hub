import { useState, useCallback, useEffect, useRef } from "react";

// fetchFn – async function to call
// validate – optional function to validate the result
// args – optional array of arguments to pass to fetchFn (e.g. [season])
export const useFetchData = <T>(
  fetchFn: (...args: unknown[]) => Promise<T | null>,
  validate?: (data: T) => boolean,
  args: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use refs so `load` stays stable while always calling the latest fetchFn/validate/args
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;
  const validateRef = useRef(validate);
  validateRef.current = validate;
  const argsRef = useRef(args);
  argsRef.current = args;

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const result = await fetchRef.current(...argsRef.current);
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

  // Re-run load when args change (e.g. season changes)
  const argsKey = JSON.stringify(args);
  useEffect(() => {
    setData(null);
    setError(null);
    load();
  }, [load, argsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refreshing, lastUpdated, refresh: () => load(true) };
};
