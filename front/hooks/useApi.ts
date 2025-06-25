import { useState, useEffect } from 'react';
import { apiService, ApiResponse } from '@/lib/api';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
      }
      
      setLoading(false);
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

export function useApiMutation<T, R>(
  apiCall: (data: T) => Promise<ApiResponse<R>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<R | null>(null);

  const mutate = async (payload: T) => {
    setLoading(true);
    setError(null);
    
    const result = await apiCall(payload);
    
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setData(result.data);
    }
    
    setLoading(false);
    return result;
  };

  return { mutate, data, loading, error };
} 