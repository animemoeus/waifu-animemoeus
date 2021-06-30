import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { useState } from "react";

import { Layout } from "../components/templates";
import { Navbar } from "../components/molecules";

export default function Home(props) {
  const [images, setImages] = useState(
    props.images.length === 0 ? props.response.results : props.images
  );
  const [hasMore, setHasMore] = useState(true);
  const [pageNow, setPageNow] = useState(
    props.pageNow === 1 ? 1 : props.pageNow
  );

  const fetchMoreData = () => {
    fetch(`https://api.animemoe.us/waifu/?page=${pageNow + 1}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.next === null) {
          setHasMore(false);
        }

        setImages(images.concat(response.results));
        setPageNow(parseInt(pageNow) + 1);

        props.setImages(images);
        props.setPageNow(pageNow);
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
            loader={<p className="text-center text-lg">Loading...</p>}
          >
            <Masonry
              breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => {
                return (
                  <div
                    key={image.id}
                    className="rounded-md shadow-md border border-gray-200 bg-gray-200 overflow-hidden"
                  >
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
                          className="rounded-md"
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

export async function getStaticProps() {
  const res = await fetch("https://api.animemoe.us/waifu/");
  const response = await res.json();

  return { props: { response: response }, revalidate: 300 };
}
