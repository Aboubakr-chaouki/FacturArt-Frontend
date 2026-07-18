import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { AxiosError } from "axios";

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  initialData?: T;
  errorMessage?: string;
  immediate?: boolean;
}

export const useFetch = <T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) => {
  const { immediate = true, errorMessage = "Une erreur est survenue", onSuccess, onError } = options;
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message || axiosError.message || errorMessage;
      setError(msg);
      toast.error(msg);
      onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, errorMessage]); // onSuccess et onError ne doivent pas être des dépendances si non stables

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute]); // Suppression de immediate des dépendances car execute en dépend déjà indirectement ou est stable

  return {
    data,
    isLoading,
    error,
    execute,
    setData
  };
};
