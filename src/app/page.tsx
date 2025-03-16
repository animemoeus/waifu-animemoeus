'use client';

import ImageCard from "@/components/ui/image-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Masonry from 'react-masonry-css'
import InfiniteScroll from "react-infinite-scroll-component";

export interface IWaifu {
  id: number;
  image_id: string;
  original_image: string;
  thumbnail: string;
  blur_data_url: string;
  is_nsfw: boolean;
  width: number;
  height: number;
  creator_name: string;
  creator_username: string;
  caption: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface IWaifuResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IWaifu[];
}

export default function Home() {
  const [waifus, setWaifus] = useState<IWaifu[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("https://api.animemoe.us/waifu/");
  const [hasMore, setHasMore] = useState(true);

  const queryClient = useQueryClient();

  // Initial data fetch
  const { isLoading: isLoadingWaifuResponse, isError: isErrorWaifuResponse, error: errorWaifuResponse } = useQuery<IWaifuResponse>({
    queryKey: ["home"],
    queryFn: async () => {
      if (!nextUrl) return { count: 0, next: null, previous: null, results: [] };

      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Update state with fetched data
      setWaifus((prevWaifus) => [...prevWaifus, ...data.results]);
      setNextUrl(data.next);
      setHasMore(!!data.next);

      return data;
    },
    enabled: !!nextUrl,
  });

  // Function to fetch more data when scrolling
  const fetchMoreData = async () => {
    if (!nextUrl) {
      setHasMore(false);
      return;
    }

    try {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: IWaifuResponse = await response.json();

      setWaifus((prevWaifus) => [...prevWaifus, ...data.results]);
      setNextUrl(data.next);
      setHasMore(!!data.next);

      // Update query cache
      queryClient.setQueryData(["home"], data);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  useEffect(() => {
    console.log('waifus', waifus);
  }, [waifus]);

  useEffect(() => {
    console.log('next url', nextUrl);
  }, [nextUrl]);

  useEffect(() => {
    console.log('is loading', isLoadingWaifuResponse);
  }, [isLoadingWaifuResponse]);

  useEffect(() => {
    console.log('error waifu', isErrorWaifuResponse);
  }, [isErrorWaifuResponse]);

  useEffect(() => {
    console.log('error', errorWaifuResponse);
  }, [errorWaifuResponse]);

  return (
    <div>
      {isLoadingWaifuResponse && waifus.length === 0 && <p className="text-center">Loading...</p>}
      {isErrorWaifuResponse && <p className="text-center text-red-500">Error loading data</p>}

      <h1 className="text-center mt-2 mb-3 text-2xl md:text-3xl lg:text-4xl font-bold overflow-auto">instagram.com/arter_tendean</h1>

      <InfiniteScroll
        dataLength={waifus.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading more...</p>}
        endMessage={<p className="text-center py-4">No more images to load</p>}
      >
        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
          className="my-masonry-grid pl-1 pr-2"
          columnClassName="my-masonry-grid_column">
          {waifus.map((waifu) => (
            <div key={waifu.id} className="rounded-base">
              <ImageCard imageUrl={waifu.thumbnail} caption={waifu.caption} width={waifu.width} height={waifu.height} blurDataURL={waifu.blur_data_url} raw={waifu} />
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  )
}