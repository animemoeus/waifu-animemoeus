import Image from 'next/image';

type Props = {
  imageUrl: string;
  caption: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export default function ImageCard({
  imageUrl,
  caption,
  width = 250,
  height = 188,
  blurDataURL
}: Props) {
  return (
    <figure className="w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
      <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
        <Image
          src={imageUrl}
          alt={caption || "image"}
          width={width}
          height={height}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={`data:image/png;base64,${blurDataURL}`}
          className="object-cover w-full h-full"
        />
      </div>
      <figcaption className="border-t-2 text-mtext border-border p-4">
        {caption}
      </figcaption>
    </figure>
  )
}
