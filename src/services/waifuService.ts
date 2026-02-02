import axios from 'axios'
import type { WaifuApiResponse, WaifuPaginationParams } from '@/types/waifu'

const API_BASE_URL = 'https://api.animemoe.us'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const waifuService = {
  async fetchWaifus(
    params: WaifuPaginationParams = {}
  ): Promise<WaifuApiResponse> {
    const {
      page = 1,
      is_nsfw = false,
    } = params

    const response = await apiClient.get<WaifuApiResponse>('/waifu/', {
      params: {
        format: 'json',
        page,
        is_nsfw,
      },
    })

    return response.data
  },
}
