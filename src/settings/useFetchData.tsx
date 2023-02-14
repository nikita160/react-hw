import { useState, useEffect, useCallback, useRef } from 'react';
import { GetDataCallback } from '../api';

const TIMEOUT_INTERVAL = 1000;

type FetchingData<T> = {
  isLoading: boolean;
  data: T | null;
};

export default function useFetchData<P, T>(
  callback: GetDataCallback<P, T>,
  params: P,
  deps: any[],
  shouldFetchCallback?: () => boolean
): FetchingData<T> {
  const [data, setData] = useState<FetchingData<T>>({
    isLoading: false,
    data: null,
  });

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldFetchCallback || shouldFetchCallback()) {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        setData({ isLoading: true, data: null });
        callback(params)
          .then((res) => {
            {
              setData({ isLoading: false, data: res });
            }
          })
          .catch(() => {
            setData({ isLoading: false, data: null });
          });
      }, TIMEOUT_INTERVAL);
    }

    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, deps);

  return data;
}
