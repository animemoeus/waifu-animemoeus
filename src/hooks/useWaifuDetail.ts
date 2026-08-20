import { useQuery } from '@tanstack/react-query'
import { waifuService } from '@/services/waifuService'

export const useWaifuDetail = (imageId: string) => {
  return useQuery({
    queryKey: ['waifu', imageId],
    queryFn: () => waifuService.getWaifuDetail(imageId),
    enabled: Boolean(imageId),
  })
}
