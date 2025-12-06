import { QueryCache, QueryClient } from '@tanstack/react-query'

import { handleApiError } from '~/lib/api-client'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  defaultOptions: {
    queries: {
      gcTime: 0,
      retry: false,
      staleTime: 0,
    },
  },
})
