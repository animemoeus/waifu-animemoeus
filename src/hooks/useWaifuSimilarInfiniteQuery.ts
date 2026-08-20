import { useInfiniteQuery } from '@tanstack/react-query'
import type { WaifuSimilarParams } from '@/types/waifu'
import { waifuService } from '@/services/waifuService'

export const useWaifuSimilarInfiniteQuery = (
  imageId: string,
  params: WaifuSimilarParams = {},
) => {
  return useInfiniteQuery({
    queryKey: ['waifu-similar', imageId, params],
    queryFn: ({ pageParam }) =>
      waifuService.getSimilarWaifus(imageId, {
        ...params,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const cursor = new URL(lastPage.next).searchParams.get('cursor')
      return cursor ?? undefined
    },
    initialPageParam: undefined as string | undefined,
    enabled: Boolean(imageId),
  })
}
