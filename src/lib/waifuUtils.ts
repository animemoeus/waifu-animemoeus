export const MASONRY_BREAKPOINTS = {
  default: 5,
  1536: 5,
  1280: 4,
  1024: 3,
  768: 2,
  640: 1,
}

const MIN_ASPECT_RATIO = 0.35
const MAX_ASPECT_RATIO = 3
const FALLBACK_ASPECT_RATIO = 0.75

/**
 * Computes a bounded width/height aspect ratio for masonry and detail frames,
 * falling back to 0.75 when dimensions are missing or invalid.
 */
export function getSafeAspectRatio(width?: number, height?: number): number {
  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return FALLBACK_ASPECT_RATIO
  }

  const ratio = width / height
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return FALLBACK_ASPECT_RATIO
  }

  return Math.min(MAX_ASPECT_RATIO, Math.max(MIN_ASPECT_RATIO, ratio))
}

/**
 * Normalizes a raw base64 or data-URI blur placeholder string into a valid
 * browser image data URL, detecting PNG and WebP signatures before falling
 * back to JPEG.
 */
export function normalizeBlurDataUrl(
  blurDataUrl?: string | null,
): string | null {
  if (typeof blurDataUrl !== 'string') {
    return null
  }

  const trimmed = blurDataUrl.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('data:')) {
    return trimmed
  }

  if (trimmed.startsWith('iVBOR')) {
    return `data:image/png;base64,${trimmed}`
  }

  if (trimmed.startsWith('UklGR')) {
    return `data:image/webp;base64,${trimmed}`
  }

  return `data:image/jpeg;base64,${trimmed}`
}

/**
 * Safely extracts a query parameter from either an absolute or relative URL.
 */
export function extractQueryParamFromUrl(
  urlString: string | null | undefined,
  param: string,
): string | undefined {
  if (typeof urlString !== 'string' || !param) {
    return undefined
  }

  const trimmed = urlString.trim()
  if (!trimmed) {
    return undefined
  }

  try {
    const parsed = new URL(trimmed, 'https://placeholder.local')
    const value = parsed.searchParams.get(param)
    return value ? value : undefined
  } catch {
    return undefined
  }
}

/**
 * Formats positive pixel dimensions as "W × H px", or null when invalid.
 */
export function formatDimensions(
  width?: number,
  height?: number,
): string | null {
  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null
  }

  return `${Math.round(width)} × ${Math.round(height)} px`
}

const UTC_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

/**
 * Formats an ISO timestamp string into a UTC human-readable date, or null.
 */
export function formatCreatedDate(isoDate?: string | null): string | null {
  if (typeof isoDate !== 'string') {
    return null
  }

  const trimmed = isoDate.trim()
  if (!trimmed) {
    return null
  }

  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return UTC_DATE_FORMATTER.format(date)
}
