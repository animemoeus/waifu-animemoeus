import { queryOptions, useQuery } from '@tanstack/react-query'
import { waifuService } from '@/services/waifuService'

export const waifuDetailQueryOptions = (imageId: string) =>
  queryOptions({
    queryKey: ['waifu', imageId],
    queryFn: () => waifuService.getWaifuDetail(imageId),
    enabled: Boolean(imageId),
  })

export const useWaifuDetail = (imageId: string) => {
  return useQuery(waifuDetailQueryOptions(imageId))
}
