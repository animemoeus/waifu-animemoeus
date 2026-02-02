import { createLazyFileRoute } from '@tanstack/react-router'
import { useWaifuInfiniteQuery } from '@/hooks/useWaifuInfiniteQuery'
import { WaifuCard } from '@/components/WaifuCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'

export const Route = createLazyFileRoute('/waifu')({
  component: WaifuPage,
})

function WaifuPage() {
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useWaifuInfiniteQuery({ is_nsfw: false })

  const waifus = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading waifus...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            Error loading waifus: {error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Anime Waifus Gallery
          </h1>
          <p className="text-gray-600">
            Browse beautiful anime characters from AnimeMoe
          </p>
        </div>

        {waifus.length > 0 ? (
          <InfiniteScroll
            dataLength={waifus.length}
            next={() => fetchNextPage()}
            hasMore={hasNextPage || false}
            loader={
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            }
            endMessage={
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">
                  You've reached the end! ({waifus.length} waifus loaded)
                </p>
              </div>
            }
          >
            <Masonry
              breakpointCols={{
                default: 6,
                1536: 6,
                1280: 5,
                1024: 4,
                768: 3,
                640: 2,
                0: 1,
              }}
              className="masonry-grid"
              columnClassName="masonry-grid-column"
            >
              {waifus.map((waifu) => {
                const aspectRatio = waifu.width / waifu.height
                return (
                  <WaifuCard
                    key={waifu.id}
                    waifu={waifu}
                    aspectRatio={aspectRatio}
                  />
                )
              })}
            </Masonry>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No waifus found</p>
          </div>
        )}
      </div>
    </div>
  )
}
