import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import type { WaifuSimilarParams } from '@/types/waifu'
import { extractQueryParamFromUrl } from '@/lib/waifuUtils'
import { waifuService } from '@/services/waifuService'

export interface UseWaifuSimilarParams extends WaifuSimilarParams {
  enabled?: boolean
}

export interface UseWaifuSimilarOptions {
  enabled?: boolean
}

export const waifuSimilarInfiniteQueryOptions = (
  imageId: string,
  params: UseWaifuSimilarParams = {},
  options?: UseWaifuSimilarOptions,
) => {
  const { enabled, ...queryParams } = params

  return infiniteQueryOptions({
    queryKey: ['waifu-similar', imageId, queryParams],
    queryFn: ({ pageParam }) =>
      waifuService.getSimilarWaifus(imageId, {
        ...queryParams,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      extractQueryParamFromUrl(lastPage.next, 'cursor'),
    initialPageParam: undefined as string | undefined,
    enabled: options?.enabled ?? enabled ?? Boolean(imageId),
  })
}

export const useWaifuSimilarInfiniteQuery = (
  imageId: string,
  params: UseWaifuSimilarParams = {},
  options?: UseWaifuSimilarOptions,
) => {
  return useInfiniteQuery(
    waifuSimilarInfiniteQueryOptions(imageId, params, options),
  )
}
