'use client'

import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import { useState } from 'react'
import Navbar from './components/molecules/Navbar/Navbar'

async function getInitialWaifus() {
  const res = await fetch('https://api.animemoe.us/waifu/')
  return res.json()
}

export default function Home() {
  const [images, setImages] = useState([])
  const [nextPageURL, setNextPageURL] = useState('')
  const [hasMore, setHasMore] = useState(true)

  useState(async () => {
    const initialData = await getInitialWaifus()
    setImages(initialData.results)
    setNextPageURL(initialData.next.replace('http://', 'https://'))
  }, [])

  const fetchMoreData = async () => {
    const res = await fetch(nextPageURL)
    const response = await res.json()

    if (response.next === null) {
      setHasMore(false)
    } else {
      setNextPageURL(response.next.replace('http://', 'https://'))
    }

    setImages(prevImages => [...prevImages, ...response.results])
  }

  return (
      <div className="min-h-screen">
        <Navbar />

        <div className="pt-3 px-2">
          <InfiniteScroll
            dataLength={images.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<p className="text-center">Loading...</p>}
          >
            <Masonry
              breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => (
                <div key={image.id}>
                  <Link href={`/${image.image_id}/`}>
                    <Image
                      src={image.thumbnail}
                      quality={66}
                      width={image.width}
                      height={image.height}
                      alt={`Image ${image.image_id} by ${image.creator_name}`}
                      placeholder="blur"
                      blurDataURL={encodeURIComponent(
                        `${image.thumbnail}&height=${parseInt(
                          (image.height * 1) / 100
                        )}`
                      )}
                      className="rounded border shadow-sm"
                    />
                  </Link>
                </div>
              ))}
            </Masonry>
          </InfiniteScroll>
        </div>
      </div>
  )
}