import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api.config';

// Custom hook for GET requests
export const useFetch = (key, url, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const { data } = await api.get(url);
      return data;
    },
    ...options,
  });
};

// Custom hook for POST/PUT/DELETE requests
export const useMutate = (key, method, url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: Array.isArray(key) ? key : [key], 
    mutationFn: async (payload) => {
      const { data } = await api[method](url, payload);
      return data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

// Custom hook for handling loading and error states
export const useQueryState = (query) => {
  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    data: query.data,
    isFetching: query.isFetching
  };
}; 