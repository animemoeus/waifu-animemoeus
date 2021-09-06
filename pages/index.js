import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { useState } from "react";

import { Layout } from "../components/templates";
import { Navbar } from "../components/molecules";

export default function Home(props) {
  const [images, setImages] = useState(props.response.results);
  const [nextPageURL, setNextPageURL] = useState(
    props.response.next.replace("http://", "https://")
  );
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    fetch(nextPageURL)
      .then((res) => res.json())
      .then((response) => {
        // for infinite scroll
        if (response.next === null) {
          setHasMore(false);
        } else {
          //update next page url
          setNextPageURL(response.next.replace("http://", "https://"));
        }

        // update images state using data API
        setImages(images.concat(response.results));
      });
  };

  return (
    <Layout title="Waifu | AnimeMoeUs" description="Waifu Collections">
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
              {images.map((image) => {
                return (
                  <div key={image.id}>
                    <Link href={`/${image.image_id}/`}>
                      <a>
                        <Image
                          src={image.thumbnail}
                          quality={10}
                          width={image.width}
                          height={image.height}
                          alt={`Image ${image.image_id} by ${image.creator_name}`}
                          placeholder="blur"
                          blurDataURL={`${image.thumbnail}?width=${parseInt(
                            (image.width * 1) / 100
                          )}&height=${parseInt((image.height * 1) / 100)}`}
                          layout="responsive"
                          className="rounded border shadow-sm"
                        />
                      </a>
                    </Link>
                  </div>
                );
              })}
            </Masonry>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  let url = await "https://api.animemoe.us/waifu/";

  const res = await fetch(`${url}?nsfw=${query.nsfw || false}`);
  const response = await res.json();
  console.log(response.next);

  return { props: { response: response } };
}
