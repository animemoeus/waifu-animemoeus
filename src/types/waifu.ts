export interface Waifu {
  id: number
  image_id: string
  original_image: string
  thumbnail: string
  blur_data_url: string
  is_nsfw: boolean
  width: number
  height: number
  creator_name: string
  creator_username: string
  caption: string
  source: string
  created_at: string
  updated_at: string
}

export interface WaifuApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Waifu[]
}

export interface WaifuPaginationParams {
  page?: number
  is_nsfw?: boolean
}
