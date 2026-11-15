import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  MASONRY_BREAKPOINTS,
  extractQueryParamFromUrl,
  formatCreatedDate,
  formatDimensions,
  getSafeAspectRatio,
  normalizeBlurDataUrl,
} from '@/lib/waifuUtils'
import { WaifuApiError, waifuService } from '@/services/waifuService'

function createMockWaifu(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    image_id: 'img123',
    original_image: 'https://example.com/orig.jpg',
    thumbnail: 'https://example.com/thumb.jpg',
    blur_data_url: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB',
    is_nsfw: false,
    width: 1000,
    height: 1500,
    creator_name: 'Artist',
    creator_username: 'artist_user',
    caption: 'Awesome Waifu',
    source: 'https://pixiv.net',
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
    ...overrides,
  }
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('waifuService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches paginated waifus and strips embedding arrays', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      createJsonResponse({
        count: 1,
        next: 'https://api.animemoe.us/waifu/?format=json&is_nsfw=false&page=2',
        previous: null,
        results: [
          createMockWaifu({
            embedding: Array.from({ length: 512 }, (_, i) => i * 0.01),
            extra_field: 'should-be-stripped',
          }),
        ],
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await waifuService.fetchWaifus({ page: 1, is_nsfw: false })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [requestUrl, requestInit] = fetchMock.mock.calls[0]
    expect(String(requestUrl)).toContain('https://api.animemoe.us/waifu/')
    expect(String(requestUrl)).toContain('format=json')
    expect(String(requestUrl)).toContain('page=1')
    expect(String(requestUrl)).toContain('is_nsfw=false')
    expect(requestInit?.signal).toBeInstanceOf(AbortSignal)

    expect(result.count).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].image_id).toBe('img123')
    expect('embedding' in result.results[0]).toBe(false)
    expect('extra_field' in result.results[0]).toBe(false)
  })

  it('fetches waifu detail and strips embedding', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      createJsonResponse(
        createMockWaifu({
          embedding: [0.1, 0.2, 0.3],
        }),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await waifuService.getWaifuDetail('img123')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.animemoe.us/waifu/img123/?format=json',
    )
    expect(result.image_id).toBe('img123')
    expect(result.creator_name).toBe('Artist')
    expect('embedding' in result).toBe(false)
  })

  it('fetches similar waifus and omits undefined optional params', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      createJsonResponse({
        next: 'https://api.animemoe.us/waifu/img123/similar/?cursor=nextcursor',
        previous: null,
        results: [
          createMockWaifu({
            id: 2,
            image_id: 'img456',
            creator_name: 'Artist 2',
            creator_username: 'artist2',
            caption: 'Similar Artwork',
            embedding: [0.5, 0.6],
          }),
        ],
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await waifuService.getSimilarWaifus('img123', {
      cursor: 'init',
      is_nsfw: undefined,
    })

    const requestUrl = String(fetchMock.mock.calls[0][0])
    expect(requestUrl).toContain('/waifu/img123/similar/')
    expect(requestUrl).toContain('cursor=init')
    expect(requestUrl).not.toContain('is_nsfw')

    expect(result.results).toHaveLength(1)
    expect(result.results[0].image_id).toBe('img456')
    expect(result.next).toContain('cursor=nextcursor')
    expect('embedding' in result.results[0]).toBe(false)
  })

  it('throws WaifuApiError with status and friendly message on non-OK HTTP responses', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
      .mockResolvedValueOnce(new Response('Server Error', { status: 503 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(waifuService.getWaifuDetail('missing')).rejects.toMatchObject({
      name: 'WaifuApiError',
      status: 404,
      message: 'The requested artwork could not be found.',
    })

    try {
      await waifuService.fetchWaifus()
      expect.unreachable('Expected WaifuApiError to be thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(WaifuApiError)
      expect((error as WaifuApiError).status).toBe(503)
      expect((error as WaifuApiError).message).toContain(
        'temporarily unavailable',
      )
    }
  })

  it('returns an empty result on HTTP 400 for getSimilarWaifus while still throwing on 500', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify(['Image does not have an embedding yet.']),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(new Response('Server Error', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    const emptyResult = await waifuService.getSimilarWaifus('unindexed123')
    expect(emptyResult).toEqual({
      next: null,
      previous: null,
      results: [],
    })

    await expect(
      waifuService.getSimilarWaifus('unindexed123'),
    ).rejects.toMatchObject({
      name: 'WaifuApiError',
      status: 500,
    })
  })
})

describe('waifuUtils', () => {
  it('exports consistent masonry breakpoints', () => {
    expect(MASONRY_BREAKPOINTS).toEqual({
      default: 5,
      1536: 5,
      1280: 4,
      1024: 3,
      768: 2,
      640: 1,
    })
  })

  describe('getSafeAspectRatio', () => {
    it('computes and clamps aspect ratio within [0.35, 3]', () => {
      expect(getSafeAspectRatio(1000, 1500)).toBeCloseTo(2 / 3)
      expect(getSafeAspectRatio(100, 1000)).toBe(0.35)
      expect(getSafeAspectRatio(4000, 500)).toBe(3)
    })

    it('returns 0.75 fallback for invalid or zero dimensions', () => {
      expect(getSafeAspectRatio(undefined, 1000)).toBe(0.75)
      expect(getSafeAspectRatio(1000, 0)).toBe(0.75)
      expect(getSafeAspectRatio(-500, 1000)).toBe(0.75)
      expect(getSafeAspectRatio(Number.NaN, 1000)).toBe(0.75)
      expect(getSafeAspectRatio(Number.POSITIVE_INFINITY, 1000)).toBe(0.75)
    })
  })

  describe('normalizeBlurDataUrl', () => {
    it('returns null for empty or nullish inputs', () => {
      expect(normalizeBlurDataUrl(null)).toBeNull()
      expect(normalizeBlurDataUrl(undefined)).toBeNull()
      expect(normalizeBlurDataUrl('   ')).toBeNull()
    })

    it('preserves existing data: URIs', () => {
      const existing = 'data:image/png;base64,iVBORw0KGgo='
      expect(normalizeBlurDataUrl(existing)).toBe(existing)
    })

    it('detects PNG, WebP, and defaults to JPEG base64', () => {
      expect(normalizeBlurDataUrl('iVBORw0KGgoAAAANSUhEUg==')).toBe(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==',
      )
      expect(normalizeBlurDataUrl('UklGRh4AAABXRUJQ')).toBe(
        'data:image/webp;base64,UklGRh4AAABXRUJQ',
      )
      expect(normalizeBlurDataUrl('/9j/4AAQSkZJRg==')).toBe(
        'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      )
    })
  })

  describe('extractQueryParamFromUrl', () => {
    it('extracts query params from absolute and relative URLs', () => {
      expect(
        extractQueryParamFromUrl(
          'https://api.animemoe.us/waifu/?format=json&page=3',
          'page',
        ),
      ).toBe('3')
      expect(
        extractQueryParamFromUrl('/waifu/abc/similar/?cursor=xyz%3D', 'cursor'),
      ).toBe('xyz=')
      expect(extractQueryParamFromUrl('?page=7', 'page')).toBe('7')
    })

    it('returns undefined when URL or param is missing or malformed', () => {
      expect(extractQueryParamFromUrl(null, 'page')).toBeUndefined()
      expect(extractQueryParamFromUrl(undefined, 'page')).toBeUndefined()
      expect(extractQueryParamFromUrl('', 'page')).toBeUndefined()
      expect(
        extractQueryParamFromUrl('https://api.animemoe.us/waifu/', 'page'),
      ).toBeUndefined()
      expect(
        extractQueryParamFromUrl('http://[invalid', 'page'),
      ).toBeUndefined()
    })
  })

  describe('formatDimensions', () => {
    it('formats positive dimensions and returns null for invalid values', () => {
      expect(formatDimensions(1200, 1800)).toBe('1200 × 1800 px')
      expect(formatDimensions(1200.4, 1800.6)).toBe('1200 × 1801 px')
      expect(formatDimensions(0, 1800)).toBeNull()
      expect(formatDimensions(undefined, 1800)).toBeNull()
    })
  })

  describe('formatCreatedDate', () => {
    it('formats valid ISO dates in UTC and returns null for invalid inputs', () => {
      expect(formatCreatedDate('2026-01-15T12:00:00Z')).toBe('Jan 15, 2026')
      expect(formatCreatedDate(null)).toBeNull()
      expect(formatCreatedDate('')).toBeNull()
      expect(formatCreatedDate('not-a-date')).toBeNull()
    })
  })
})
