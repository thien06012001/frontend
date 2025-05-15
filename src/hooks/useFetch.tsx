import { useEffect, useState } from 'react';
import { handleAPI } from '../handlers/api-handler';

export const useFetch = (url: string, options: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await handleAPI(url, options);
      if (!response.ok) {
        setError(new Error('Network response was not ok'));
        setIsLoading(false);
        return;
      }
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return { isLoading, error, data };
};
