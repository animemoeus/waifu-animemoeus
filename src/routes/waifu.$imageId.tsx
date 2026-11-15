import {
  Link,
  createFileRoute,
  isNotFound,
  notFound,
} from '@tanstack/react-router'
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  ImageOff,
  Loader2,
  Maximize2,
  RotateCw,
  Ruler,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { GalleryHeader } from '@/components/GalleryHeader'
import { WaifuCard } from '@/components/WaifuCard'
import { useWaifuDetail, waifuDetailQueryOptions } from '@/hooks/useWaifuDetail'
import { useWaifuSimilarInfiniteQuery } from '@/hooks/useWaifuSimilarInfiniteQuery'
import {
  MASONRY_BREAKPOINTS,
  formatCreatedDate,
  formatDimensions,
  getSafeAspectRatio,
  normalizeBlurDataUrl,
} from '@/lib/waifuUtils'
import { WaifuApiError } from '@/services/waifuService'

function getDetailErrorMessage(error: unknown): string {
  if (error instanceof WaifuApiError) {
    return error.message
  }
  return 'Could not load this artwork right now. Please try again.'
}

export const Route = createFileRoute('/waifu/$imageId')({
  loader: async ({ context, params }) => {
    try {
      const waifu = await context.queryClient.ensureQueryData(
        waifuDetailQueryOptions(params.imageId),
      )
      if (waifu.is_nsfw) {
        throw notFound()
      }
      return waifu
    } catch (err) {
      if (err instanceof WaifuApiError && err.status === 404) {
        throw notFound()
      }
      if (isNotFound(err)) {
        throw err
      }
      return null
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          {
            title: 'Artwork Detail — Anime Waifus Gallery',
          },
          {
            name: 'description',
            content: 'View anime artwork details and similar illustrations.',
          },
        ],
      }
    }

    const title = loaderData.caption.trim() || 'Untitled Artwork'
    const artist = loaderData.creator_name.trim()
    const description = artist
      ? `${title} by ${artist} — Anime Waifus Gallery`
      : `${title} — Anime Waifus Gallery`
    const ogImage = loaderData.thumbnail || loaderData.original_image

    return {
      meta: [
        {
          title: `${title} — Anime Waifus Gallery`,
        },
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        ...(ogImage
          ? [
              {
                property: 'og:image',
                content: ogImage,
              },
            ]
          : []),
      ],
    }
  },
  component: WaifuDetailPage,
})

function WaifuDetailPage() {
  const { imageId } = Route.useParams()
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)

  const {
    data: waifu,
    isLoading,
    isError,
    error,
    refetch,
  } = useWaifuDetail(imageId)

  const {
    data: similarData,
    fetchNextPage,
    hasNextPage,
    isLoading: isSimilarLoading,
    isError: isSimilarError,
    refetch: refetchSimilar,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useWaifuSimilarInfiniteQuery(
    imageId,
    { is_nsfw: false },
    { enabled: Boolean(imageId && waifu && !waifu.is_nsfw) },
  )

  const similarWaifus = useMemo(
    () =>
      similarData?.pages
        .flatMap((page) => page.results)
        .filter((item) => !item.is_nsfw) ?? [],
    [similarData],
  )

  const fullImageUrl = waifu?.original_image || waifu?.thumbnail || ''

  useEffect(() => {
    setHasImageError(false)
    const img = imgRef.current
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        setIsImageLoaded(true)
      } else {
        setHasImageError(true)
        setIsImageLoaded(false)
      }
    } else {
      setIsImageLoaded(false)
    }
  }, [fullImageUrl])

  if (isLoading) {
    return (
      <>
        <GalleryHeader backToGallery />
        <main
          id="main-content"
          className="relative z-10 min-h-[calc(100vh-4rem)] text-ink"
        >
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[60vh] w-full items-center justify-center px-4"
          >
            <div className="text-center">
              <Loader2
                className="mx-auto mb-4 h-10 w-10 animate-spin text-accent"
                aria-hidden="true"
              />
              <p className="text-base font-medium text-muted">
                Loading artwork...
              </p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (isError || !waifu || waifu.is_nsfw) {
    return (
      <>
        <GalleryHeader backToGallery />
        <main
          id="main-content"
          className="relative z-10 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-12 text-ink"
        >
          <div
            role="alert"
            className="w-full max-w-md rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm"
          >
            <AlertCircle
              className="mx-auto mb-4 h-10 w-10 text-danger"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Could not load artwork
            </h1>
            <p className="mt-2 text-sm text-muted">
              {getDetailErrorMessage(error)}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void refetch()
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-subtle px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-canvas"
              >
                <RotateCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
              >
                Back to Gallery
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const title = waifu.caption.trim() || 'Untitled Anime Artwork'
  const artistName = waifu.creator_name.trim() || 'Unknown Artist'
  const artistUsername = waifu.creator_username.trim()
  const blurDataUrl = normalizeBlurDataUrl(waifu.blur_data_url)
  const dimensions = formatDimensions(waifu.width, waifu.height)
  const createdDate = formatCreatedDate(waifu.created_at)

  return (
    <>
      <GalleryHeader backToGallery />

      <main
        id="main-content"
        className="relative z-10 min-h-[calc(100vh-4rem)] text-ink"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <div
                className="relative mx-auto w-full max-h-[85vh] overflow-hidden rounded-2xl border border-line bg-subtle shadow-sm"
                style={{
                  aspectRatio: String(
                    getSafeAspectRatio(waifu.width, waifu.height),
                  ),
                }}
              >
                {blurDataUrl && !hasImageError && (
                  <img
                    src={blurDataUrl}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
                  />
                )}

                {fullImageUrl && !hasImageError ? (
                  <img
                    ref={imgRef}
                    src={fullImageUrl}
                    alt={title}
                    onLoad={() => {
                      setIsImageLoaded(true)
                      setHasImageError(false)
                    }}
                    onError={() => {
                      setHasImageError(true)
                      setIsImageLoaded(false)
                    }}
                    className={`relative h-full w-full object-contain transition-opacity duration-300 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-subtle p-6 text-center text-muted">
                    <ImageOff className="h-8 w-8 shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium">Image unavailable</p>
                  </div>
                )}

                {fullImageUrl && !isImageLoaded && !hasImageError && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/10"
                  >
                    <Loader2
                      className="h-8 w-8 animate-spin text-accent"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      Loading full resolution artwork...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-4 lg:col-span-5 xl:col-span-4">
              <div className="space-y-5 rounded-2xl border border-line bg-elevated/95 p-6 shadow-sm">
                <h1 className="break-words text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {title}
                </h1>

                <div className="space-y-2.5 border-t border-line pt-4 text-sm">
                  <div className="flex items-start gap-2.5 text-ink">
                    <User
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-medium">{artistName}</p>
                      {artistUsername && (
                        <p className="truncate text-xs text-muted">
                          @{artistUsername}
                        </p>
                      )}
                    </div>
                  </div>

                  {dimensions && (
                    <div className="flex items-center gap-2.5 text-muted">
                      <Ruler className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="tabular-nums">{dimensions}</span>
                    </div>
                  )}

                  {createdDate && (
                    <div className="flex items-center gap-2.5 text-muted">
                      <Calendar
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{createdDate}</span>
                    </div>
                  )}
                </div>

                {(fullImageUrl || waifu.source) && (
                  <div className="flex flex-col gap-2.5 border-t border-line pt-4">
                    {fullImageUrl && (
                      <a
                        href={fullImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
                      >
                        <Maximize2 className="h-4 w-4" aria-hidden="true" />
                        Open Full Image
                      </a>
                    )}

                    {waifu.source && (
                      <a
                        href={waifu.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-subtle px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-canvas"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Visit Source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>

          <section aria-labelledby="similar-waifus-heading">
            <div className="mb-6 flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2
                id="similar-waifus-heading"
                className="text-2xl font-bold tracking-tight text-ink"
              >
                Similar Waifus
              </h2>
            </div>

            {isSimilarLoading ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center justify-center gap-3 py-12 text-center"
              >
                <Loader2
                  className="h-8 w-8 animate-spin text-accent"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-muted">
                  Finding similar artworks...
                </p>
              </div>
            ) : isSimilarError && similarWaifus.length === 0 ? (
              <div
                role="alert"
                className="mx-auto my-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-elevated/95 p-6 text-center shadow-sm"
              >
                <AlertCircle
                  className="h-8 w-8 text-danger"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-ink">
                  Could not load similar artworks.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refetchSimilar()
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
                >
                  <RotateCw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </button>
              </div>
            ) : similarWaifus.length > 0 ? (
              <>
                <InfiniteScroll
                  dataLength={similarWaifus.length}
                  next={() => {
                    if (!isFetchingNextPage && !isFetchNextPageError) {
                      void fetchNextPage()
                    }
                  }}
                  hasMore={Boolean(hasNextPage)}
                  loader={
                    isFetchNextPageError ? null : (
                      <div
                        role="status"
                        aria-live="polite"
                        className="flex items-center justify-center gap-2 py-8 text-sm text-muted"
                      >
                        <Loader2
                          className="h-6 w-6 animate-spin text-accent"
                          aria-hidden="true"
                        />
                        <span>Loading more similar artworks...</span>
                      </div>
                    )
                  }
                  endMessage={
                    !isFetchNextPageError ? (
                      <div className="py-8 text-center">
                        <p className="tabular-nums text-sm text-muted">
                          You&apos;ve reached the end ({similarWaifus.length}{' '}
                          similar{' '}
                          {similarWaifus.length === 1 ? 'artwork' : 'artworks'}{' '}
                          loaded).
                        </p>
                      </div>
                    ) : null
                  }
                >
                  <Masonry
                    breakpointCols={MASONRY_BREAKPOINTS}
                    className="masonry-grid"
                    columnClassName="masonry-grid-column"
                  >
                    {similarWaifus.map((item) => (
                      <WaifuCard
                        key={item.image_id || item.id}
                        waifu={item}
                        aspectRatio={getSafeAspectRatio(
                          item.width,
                          item.height,
                        )}
                      />
                    ))}
                  </Masonry>
                </InfiniteScroll>

                {isFetchNextPageError && (
                  <div
                    role="alert"
                    className="mx-auto my-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-elevated/95 p-6 text-center shadow-sm"
                  >
                    <p className="text-sm font-medium text-danger">
                      Could not load more similar artworks.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        void fetchNextPage()
                      }}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
                    >
                      <RotateCw className="h-4 w-4" aria-hidden="true" />
                      Retry loading more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm">
                <p className="text-sm text-muted">
                  Similar artworks are not available for this piece yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
