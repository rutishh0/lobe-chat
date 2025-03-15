import { cache } from 'react';
import type { Key, MutatorCallback, MutatorOptions, SWRConfiguration, SWRResponse } from 'swr';

// Re-export the mutate function
export const mutate = async <T>(
  key: Key,
  data?: T | Promise<T> | MutatorCallback<T>,
  options?: boolean | MutatorOptions
): Promise<T | undefined> => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  const { mutate: mutateSWR } = require('swr');
  return mutateSWR(key, data, options);
};

// Base SWR hook for client-side data fetching
export const useClientDataSWR = <T>(
  key: Key,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration
): SWRResponse<T, Error> => {
  if (typeof window === 'undefined') {
    // Server-side: use React cache
    const cached = cache(fetcher);
    return {
      data: cached() as T,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: async () => undefined as any,
    };
  }

  // Client-side: use dynamic import
  const { default: useSWR } = require('swr');
  return useSWR(key, fetcher, config);
};

// Hook for actions that should only be fetched once
export const useOnlyFetchOnceSWR = <T>(
  key: Key,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration
): SWRResponse<T, Error> => {
  return useClientDataSWR(key, fetcher, {
    ...config,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

// Hook for action-specific data fetching
export const useActionSWR = <T>(
  key: Key,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration
): SWRResponse<T, Error> => {
  return useClientDataSWR(key, fetcher, {
    ...config,
    revalidateOnMount: true,
  });
};

export type { SWRResponse };
