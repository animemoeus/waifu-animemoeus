import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import type { WaifuPaginationParams } from '@/types/waifu'
import { extractQueryParamFromUrl } from '@/lib/waifuUtils'
import { waifuService } from '@/services/waifuService'

export const waifusInfiniteQueryOptions = (
  params: WaifuPaginationParams = {},
) =>
  infiniteQueryOptions({
    queryKey: ['waifus', params],
    queryFn: ({ pageParam }) =>
      waifuService.fetchWaifus({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const pageParam = extractQueryParamFromUrl(lastPage.next, 'page')
      if (!pageParam) return undefined
      const parsed = Number.parseInt(pageParam, 10)
      return Number.isNaN(parsed) ? undefined : parsed
    },
    initialPageParam: 1,
  })

export const useWaifuInfiniteQuery = (params: WaifuPaginationParams = {}) => {
  return useInfiniteQuery(waifusInfiniteQueryOptions(params))
}
