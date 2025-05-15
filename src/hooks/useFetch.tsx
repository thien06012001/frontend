import { useEffect, useState } from 'react';
import { handleAPI } from '../handlers/api-handler';

export const useFetch = (url: string, options: RequestInit) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await handleAPI(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { isLoading, error, data };
};
