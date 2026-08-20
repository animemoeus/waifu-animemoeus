import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import type { Waifu } from '@/types/waifu'

interface WaifuCardProps {
  waifu: Waifu
  aspectRatio: number
}

export function WaifuCard({ waifu, aspectRatio }: WaifuCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  // Convert blur_data_url to proper data URL format if needed
  const blurDataUrl = waifu.blur_data_url.startsWith('data:')
    ? waifu.blur_data_url
    : `data:image/jpeg;base64,${waifu.blur_data_url}`

  return (
    <div
      className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 bg-gray-200"
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {/* Full-bleed navigation target, sits behind everything else */}
      <Link
        to="/waifu/$imageId"
        params={{ imageId: waifu.image_id }}
        className="absolute inset-0 z-0"
        aria-label={waifu.caption || 'View waifu'}
      />

      {/* Blur placeholder - always visible as background */}
      <img
        src={blurDataUrl}
        alt={waifu.caption}
        className="absolute inset-0 w-full h-full object-cover blur-lg pointer-events-none"
        aria-hidden
      />

      {/* Main image - fades in when loaded */}
      <img
        src={waifu.thumbnail}
        alt={waifu.caption}
        className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 pointer-events-none ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleImageLoad}
      />

      {/* Loading indicator - shown while image is loading */}
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
        </div>
      )}

      {/* Hover overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        <h3 className="font-semibold text-white truncate mb-1">
          {waifu.caption}
        </h3>
        <p className="text-sm text-gray-200 truncate mb-3">
          by {waifu.creator_name}
        </p>
        {waifu.is_nsfw && (
          <span className="px-2 py-1 bg-red-500/80 text-white rounded text-xs mb-2 w-fit">
            NSFW
          </span>
        )}
        {waifu.source && (
          <a
            href={waifu.source}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-300 hover:text-blue-100 transition-colors inline-block w-fit pointer-events-auto"
            title="View Source"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>
    </div>
  )
}
