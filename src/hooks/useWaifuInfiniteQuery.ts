import { useInfiniteQuery } from '@tanstack/react-query'
import { waifuService } from '@/services/waifuService'
import type { WaifuPaginationParams } from '@/types/waifu'

export const useWaifuInfiniteQuery = (params: WaifuPaginationParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['waifus', params],
    queryFn: async ({ pageParam = 1 }) => {
      return waifuService.fetchWaifus({
        ...params,
        page: pageParam,
      })
    },
    getNextPageParam: (lastPage) => {
      // Parse the next URL to extract page number
      if (lastPage.next) {
        const url = new URL(lastPage.next)
        const pageParam = url.searchParams.get('page')
        return pageParam ? parseInt(pageParam, 10) : undefined
      }
      return undefined
    },
    initialPageParam: 1,
  })
}
