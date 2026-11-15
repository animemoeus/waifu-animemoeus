import { Link } from '@tanstack/react-router'
import { ExternalLink, ImageOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Waifu } from '@/types/waifu'
import { getSafeAspectRatio, normalizeBlurDataUrl } from '@/lib/waifuUtils'

export interface WaifuCardProps {
  waifu: Waifu
  aspectRatio?: number
}

export function WaifuCard({ waifu, aspectRatio }: WaifuCardProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
    const img = imgRef.current
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        setIsImageLoaded(true)
      } else {
        setHasError(true)
        setIsImageLoaded(false)
      }
    } else {
      setIsImageLoaded(false)
    }
  }, [waifu.thumbnail])

  const safeAspectRatio =
    typeof aspectRatio === 'number' &&
    Number.isFinite(aspectRatio) &&
    aspectRatio > 0
      ? getSafeAspectRatio(aspectRatio, 1)
      : getSafeAspectRatio(waifu.width, waifu.height)

  const blurDataUrl = normalizeBlurDataUrl(waifu.blur_data_url)
  const rawCaption = waifu.caption.trim()
  const title = rawCaption || 'Untitled artwork'
  const artistName = waifu.creator_name.trim()
  const sourceLabel = `Open source for ${rawCaption || 'artwork'}`

  return (
    <article className="group relative mb-4 rounded-xl">
      <div
        className="relative overflow-hidden rounded-xl border border-line bg-subtle shadow-sm transition-shadow duration-200 group-hover:shadow-md"
        style={{ aspectRatio: String(safeAspectRatio) }}
      >
        {blurDataUrl && !hasError && (
          <img
            src={blurDataUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
          />
        )}

        {!hasError ? (
          <img
            ref={imgRef}
            src={waifu.thumbnail}
            alt={title}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-300 motion-safe:group-hover:scale-[1.03] ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => {
              setIsImageLoaded(true)
              setHasError(false)
            }}
            onError={() => {
              setHasError(true)
              setIsImageLoaded(false)
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-subtle p-4 text-center text-muted">
            <ImageOff className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        )}

        {!isImageLoaded && !hasError && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/10"
          >
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
          </div>
        )}

        {waifu.is_nsfw && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 rounded-md bg-rose-700 px-2 py-0.5 text-xs font-semibold tracking-wide text-white shadow-sm">
            NSFW
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/65 to-transparent p-3 pt-10 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <div className={waifu.source ? 'pr-14' : ''}>
            <h3 className="truncate text-sm font-semibold text-white">
              {title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-zinc-200">
              {artistName ? `by ${artistName}` : 'Unknown artist'}
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/waifu/$imageId"
        params={{ imageId: waifu.image_id }}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        aria-label={artistName ? `${title} by ${artistName}` : `View ${title}`}
      />

      {waifu.source && (
        <a
          href={waifu.source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={sourceLabel}
          title={sourceLabel}
          className="absolute right-2.5 bottom-2.5 z-20 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 bg-black/75 text-white opacity-100 shadow-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </article>
  )
}
