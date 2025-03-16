'use client';

import ImageCard from "@/components/ui/image-card";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Masonry from 'react-masonry-css'

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

  const { data: waifuResponse, isLoading: isLoadingWaifuResponse, isError: isErrorWaifuResponse, error: errorWaifuResponse } = useQuery<IWaifuResponse>({
    queryKey: ["home"],
    queryFn: async () => {
      const response = await fetch("https://api.animemoe.us/waifu/?count=10");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    },
  });

  useEffect(() => {
    console.log(waifuResponse);
  }, [waifuResponse]);

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
      {isLoadingWaifuResponse && <p>Loading...</p>}

      <Masonry

        breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
        className="my-masonry-grid pl-1 pr-2"
        columnClassName="my-masonry-grid_column">
        {waifuResponse?.results.map((waifu) => (
          <div className="arter rounded-base">
            <ImageCard key={waifu.id} imageUrl={waifu.thumbnail} caption={waifu.caption} width={waifu.width} height={waifu.height} blurDataURL={waifu.blur_data_url} raw={waifu} />
          </div>
        ))}
      </Masonry>




    </div>
  )
}