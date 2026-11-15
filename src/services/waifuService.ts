import type {
  Waifu,
  WaifuApiResponse,
  WaifuPaginationParams,
  WaifuSimilarApiResponse,
  WaifuSimilarParams,
} from '@/types/waifu'

const API_BASE_URL = 'https://api.animemoe.us'
const REQUEST_TIMEOUT_MS = 10_000

export class WaifuApiError extends Error {
  readonly status: number

  constructor(status: number, message?: string) {
    super(message ?? WaifuApiError.getFriendlyMessage(status))
    this.name = 'WaifuApiError'
    this.status = status
  }

  static getFriendlyMessage(status: number): string {
    if (status === 404) {
      return 'The requested artwork could not be found.'
    }
    if (status === 429) {
      return 'Too many requests. Please wait a moment and try again.'
    }
    if (status >= 500) {
      return 'The AnimeMoe service is temporarily unavailable. Please try again later.'
    }
    return `Request failed with status ${status}.`
  }
}

/**
 * Picks only the fields defined on Waifu so large unused payload properties
 * such as vector `embedding` arrays are excluded from SSR and query caches.
 */
export function normalizeWaifu(
  raw: Partial<Waifu> & Record<string, unknown>,
): Waifu {
  return {
    id: Number(raw.id ?? 0),
    image_id: typeof raw.image_id === 'string' ? raw.image_id : '',
    original_image:
      typeof raw.original_image === 'string' ? raw.original_image : '',
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : '',
    blur_data_url:
      typeof raw.blur_data_url === 'string' ? raw.blur_data_url : '',
    is_nsfw: Boolean(raw.is_nsfw),
    width:
      typeof raw.width === 'number' && Number.isFinite(raw.width)
        ? raw.width
        : 0,
    height:
      typeof raw.height === 'number' && Number.isFinite(raw.height)
        ? raw.height
        : 0,
    creator_name: typeof raw.creator_name === 'string' ? raw.creator_name : '',
    creator_username:
      typeof raw.creator_username === 'string' ? raw.creator_username : '',
    caption: typeof raw.caption === 'string' ? raw.caption : '',
    source: typeof raw.source === 'string' ? raw.source : '',
    created_at: typeof raw.created_at === 'string' ? raw.created_at : '',
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : '',
  }
}

async function requestJson<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  const url = new URL(path, API_BASE_URL)
  url.searchParams.set('format', 'json')

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new WaifuApiError(response.status)
  }

  return (await response.json()) as T
}

export const waifuService = {
  async fetchWaifus(
    params: WaifuPaginationParams = {},
  ): Promise<WaifuApiResponse> {
    const { page = 1, is_nsfw = false } = params

    const data = await requestJson<WaifuApiResponse>('/waifu/', {
      page,
      is_nsfw,
    })

    return {
      ...data,
      results: Array.isArray(data.results)
        ? data.results.map((item) =>
            normalizeWaifu(item as Waifu & Record<string, unknown>),
          )
        : [],
    }
  },

  async getWaifuDetail(imageId: string): Promise<Waifu> {
    const data = await requestJson<Waifu & Record<string, unknown>>(
      `/waifu/${encodeURIComponent(imageId)}/`,
    )

    return normalizeWaifu(data)
  },

  async getSimilarWaifus(
    imageId: string,
    params: WaifuSimilarParams = {},
  ): Promise<WaifuSimilarApiResponse> {
    const { cursor, is_nsfw } = params

    try {
      const data = await requestJson<WaifuSimilarApiResponse>(
        `/waifu/${encodeURIComponent(imageId)}/similar/`,
        {
          cursor,
          is_nsfw,
        },
      )

      return {
        ...data,
        results: Array.isArray(data.results)
          ? data.results.map((item) =>
              normalizeWaifu(item as Waifu & Record<string, unknown>),
            )
          : [],
      }
    } catch (error) {
      if (error instanceof WaifuApiError && error.status === 400) {
        return {
          next: null,
          previous: null,
          results: [],
        }
      }
      throw error
    }
  },
}
