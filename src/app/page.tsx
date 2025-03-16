'use client';

import ImageCard from "@/components/ui/image-card";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface IWaifu {
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
      <h1>Home Page</h1>
      {isLoadingWaifuResponse && <p>Loading...</p>}

      {waifuResponse?.results.map((waifu) => (
        <ImageCard key={waifu.id} imageUrl={waifu.thumbnail} caption={waifu.caption} width={waifu.width} height={waifu.height} blurDataURL={waifu.blur_data_url} />
      ))}


    </div>
  )
}