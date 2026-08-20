import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { waifuService } from '@/services/waifuService'

vi.mock('axios', () => {
  const mAxios = {
    get: vi.fn(),
  }
  return {
    default: {
      create: vi.fn(() => mAxios),
    },
  }
})

describe('waifuService', () => {
  it('fetches waifu detail successfully', async () => {
    const mockWaifu = {
      id: 1,
      image_id: 'img123',
      original_image: 'https://example.com/orig.jpg',
      thumbnail: 'https://example.com/thumb.jpg',
      blur_data_url: 'abc',
      is_nsfw: false,
      width: 1000,
      height: 1500,
      creator_name: 'Artist',
      creator_username: 'artist_user',
      caption: 'Awesome Waifu',
      source: 'https://pixiv.net',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }

    const apiClient = vi.mocked(axios.create())
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockWaifu })

    const result = await waifuService.getWaifuDetail('img123')
    expect(result.image_id).toBe('img123')
    expect(result.creator_name).toBe('Artist')
  })

  it('fetches similar waifus successfully', async () => {
    const mockSimilar = {
      next: 'https://api.animemoe.us/waifu/img123/similar/?cursor=nextcursor',
      previous: null,
      results: [
        {
          id: 2,
          image_id: 'img456',
          original_image: 'https://example.com/2.jpg',
          thumbnail: 'https://example.com/2_thumb.jpg',
          blur_data_url: 'xyz',
          is_nsfw: false,
          width: 800,
          height: 1200,
          creator_name: 'Artist 2',
          creator_username: 'artist2',
          caption: 'Similar Artwork',
          source: 'https://pixiv.net',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      ],
    }

    const apiClient = vi.mocked(axios.create())
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockSimilar })

    const result = await waifuService.getSimilarWaifus('img123', {
      cursor: 'init',
    })
    expect(result.results.length).toBe(1)
    expect(result.results[0].image_id).toBe('img456')
    expect(result.next).toContain('cursor=nextcursor')
  })
})
