import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, ArrowUp, Loader2, RotateCw } from 'lucide-react'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { GalleryHeader } from '@/components/GalleryHeader'
import { WaifuCard } from '@/components/WaifuCard'
import {
  useWaifuInfiniteQuery,
  waifusInfiniteQueryOptions,
} from '@/hooks/useWaifuInfiniteQuery'
import { MASONRY_BREAKPOINTS, getSafeAspectRatio } from '@/lib/waifuUtils'
import { WaifuApiError } from '@/services/waifuService'

function getGalleryErrorMessage(error: unknown): string {
  if (error instanceof WaifuApiError) {
    return error.message
  }
  return 'Unable to connect to the AnimeMoe gallery right now. Please try again.'
}

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    try {
      await context.queryClient.prefetchInfiniteQuery(
        waifusInfiniteQueryOptions({ is_nsfw: false }),
      )
    } catch {
      // Let client query state render the recoverable error UI
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Anime Waifus Gallery',
      },
      {
        name: 'description',
        content:
          'Browse curated anime illustrations and discover visually similar artwork from AnimeMoe.',
      },
    ],
  }),
  component: WaifuGallery,
})

function WaifuGallery() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useWaifuInfiniteQuery({ is_nsfw: false })

  const waifus = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.results)
        .filter((item) => !item.is_nsfw) ?? [],
    [data],
  )

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <>
      <GalleryHeader />

      <main
        id="main-content"
        className="relative z-10 w-full min-h-[calc(100vh-4rem)] overflow-x-hidden text-ink"
      >
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex w-full min-h-[60vh] items-center justify-center px-4"
          >
            <div className="text-center">
              <Loader2
                className="mx-auto mb-4 h-10 w-10 animate-spin text-accent"
                aria-hidden="true"
              />
              <p className="text-base font-medium text-muted">
                Loading gallery...
              </p>
            </div>
          </div>
        ) : isError && waifus.length === 0 ? (
          <div
            role="alert"
            className="flex w-full min-h-[60vh] items-center justify-center px-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm">
              <AlertCircle
                className="mx-auto mb-4 h-10 w-10 text-danger"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Could not load artworks
              </h1>
              <p className="mt-2 text-sm text-muted">
                {getGalleryErrorMessage(error)}
              </p>
              <button
                type="button"
                onClick={() => {
                  void refetch()
                }}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
              >
                <RotateCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Anime Waifus Gallery
              </h1>
              <p className="mt-2 max-w-[65ch] text-base text-muted">
                Browse curated anime illustrations from AnimeMoe.
              </p>
            </div>

            {waifus.length > 0 ? (
              <>
                <InfiniteScroll
                  dataLength={waifus.length}
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
                        <span>Loading more artworks...</span>
                      </div>
                    )
                  }
                  endMessage={
                    !isFetchNextPageError ? (
                      <div className="flex flex-col items-center gap-4 py-10 text-center">
                        <p className="tabular-nums text-sm text-muted">
                          You&apos;ve reached the end ({waifus.length}{' '}
                          {waifus.length === 1 ? 'artwork' : 'artworks'}{' '}
                          loaded).
                        </p>
                        <button
                          type="button"
                          onClick={scrollToTop}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-elevated px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-subtle"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                          Back to top
                        </button>
                      </div>
                    ) : null
                  }
                >
                  <Masonry
                    breakpointCols={MASONRY_BREAKPOINTS}
                    className="masonry-grid"
                    columnClassName="masonry-grid-column"
                  >
                    {waifus.map((waifu) => (
                      <WaifuCard
                        key={waifu.image_id || waifu.id}
                        waifu={waifu}
                        aspectRatio={getSafeAspectRatio(
                          waifu.width,
                          waifu.height,
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
                      Could not load additional artworks.
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
              <div className="mx-auto my-12 max-w-md rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-ink">
                  No artworks found
                </h2>
                <p className="mt-2 text-sm text-muted">
                  No illustrations are available right now.
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
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
