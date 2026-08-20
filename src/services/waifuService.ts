import axios from 'axios'
import type {
  Waifu,
  WaifuApiResponse,
  WaifuPaginationParams,
  WaifuSimilarApiResponse,
  WaifuSimilarParams,
} from '@/types/waifu'

const API_BASE_URL = 'https://api.animemoe.us'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const waifuService = {
  async fetchWaifus(
    params: WaifuPaginationParams = {},
  ): Promise<WaifuApiResponse> {
    const { page = 1, is_nsfw = false } = params

    const response = await apiClient.get<WaifuApiResponse>('/waifu/', {
      params: {
        format: 'json',
        page,
        is_nsfw,
      },
    })

    return response.data
  },

  async getWaifuDetail(imageId: string): Promise<Waifu> {
    const response = await apiClient.get<Waifu>(`/waifu/${imageId}/`, {
      params: {
        format: 'json',
      },
    })

    return response.data
  },

  async getSimilarWaifus(
    imageId: string,
    params: WaifuSimilarParams = {},
  ): Promise<WaifuSimilarApiResponse> {
    const { cursor, is_nsfw } = params

    const response = await apiClient.get<WaifuSimilarApiResponse>(
      `/waifu/${imageId}/similar/`,
      {
        params: {
          format: 'json',
          cursor,
          is_nsfw,
        },
      },
    )

    return response.data
  },
}
