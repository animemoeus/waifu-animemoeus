import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import Masonry from 'react-masonry-css'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react'
import { useWaifuDetail } from '@/hooks/useWaifuDetail'
import { useWaifuSimilarInfiniteQuery } from '@/hooks/useWaifuSimilarInfiniteQuery'
import { WaifuCard } from '@/components/WaifuCard'

export const Route = createFileRoute('/waifu/$imageId')({
  component: WaifuDetailPage,
})

function WaifuDetailPage() {
  const { imageId } = Route.useParams()
  const navigate = useNavigate()

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
  } = useWaifuSimilarInfiniteQuery(imageId, {
    is_nsfw: waifu?.is_nsfw,
  })

  const similarWaifus = useMemo(
    () => similarData?.pages.flatMap((page) => page.results) || [],
    [similarData],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading waifu...</p>
        </div>
      </div>
    )
  }

  if (isError || !waifu) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error?.message || 'Could not load this waifu.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Retry
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    )
  }

  const blurDataUrl = waifu.blur_data_url.startsWith('data:')
    ? waifu.blur_data_url
    : `data:image/jpeg;base64,${waifu.blur_data_url}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        {/* Main image + metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative rounded-xl overflow-hidden bg-gray-200 shadow-lg">
              <img
                src={blurDataUrl}
                alt={waifu.caption}
                className="absolute inset-0 w-full h-full object-cover blur-lg"
                aria-hidden
              />
              <img
                src={waifu.original_image || waifu.thumbnail}
                alt={waifu.caption}
                className="relative w-full max-h-[85vh] object-contain"
              />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              {waifu.is_nsfw && (
                <span className="inline-block px-2 py-1 bg-red-500/80 text-white rounded text-xs">
                  NSFW
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                {waifu.caption || 'Untitled Anime Artwork'}
              </h1>

              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span>{waifu.creator_name || 'Unknown Artist'}</span>
              </div>

              <div className="text-sm text-gray-600 font-mono">
                {waifu.width} × {waifu.height} px
              </div>

              {waifu.source && (
                <a
                  href={waifu.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit Source
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Similar waifus */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Similar Waifus
            </h2>
          </div>

          {isSimilarLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            </div>
          ) : similarWaifus.length > 0 ? (
            <InfiniteScroll
              dataLength={similarWaifus.length}
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
                    You've reached the end! ({similarWaifus.length} similar
                    waifus loaded)
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
                {similarWaifus.map((item) => (
                  <WaifuCard
                    key={item.id}
                    waifu={item}
                    aspectRatio={item.width / item.height}
                  />
                ))}
              </Masonry>
            </InfiniteScroll>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No similar waifus found</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
