import { IWaifu } from '@/app/page';
import Image from 'next/image';

type Props = {
  imageUrl: string;
  caption: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  raw: IWaifu;
}

export default function ImageCard({
  imageUrl,
  caption,
  width = 250,
  height = 188,
  blurDataURL,
  raw
}: Props) {
  return (
    <figure className="w-full overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${width}/${height}` }}>
        <Image
          src={imageUrl}
          alt={caption || "image"}
          width={width}
          height={height}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={`data:image/png;base64,${blurDataURL}`}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110 hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="absolute bottom-4 left-4 text-white font-semibold">
            <span className='text-sm'>

              {raw.creator_name}
            </span>
            <br />{raw.caption}
          </div>
        </div>
      </div>
    </figure>
  )
}
