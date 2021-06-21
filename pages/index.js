import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { useState } from "react";

import { Layout } from "../components/templates";
import { Navbar } from "../components/molecules";

export default function Home(props) {
  const [images, setImages] = useState(props.response.results);
  const [hasMore, setHasMore] = useState(true);
  const [pageNow, setPageNow] = useState(1);

  const fetchMoreData = () => {
    fetch(`https://api.animemoe.us/waifu/?page=${pageNow + 1}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.next === null) {
          setHasMore(false);
        }

        setImages(images.concat(response.results));
        setPageNow(parseInt(pageNow) + 1);
      });
  };

  return (
    <Layout title="Waifu | AnimeMoeUs" description="Waifu Collections">
      <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}>
        <Navbar />

        <div className="container-fluid mt-3">
          <InfiniteScroll
            dataLength={images.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<p className="text-center fs-3">Loading...</p>}
          >
            <Masonry
              breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="card grumpy-image-wrapper bg-light border-0 rounded-0 animate__animated animate__fadeIn"
                  style={{
                    paddingBottom: `${(image.height / image.width) * 100}%`,
                  }}
                >
                  <Link href={`/${image.image_id}/`}>
                    <a>
                      <Image
                        src={image.thumbnail}
                        layout={"fill"}
                        quality={50}
                        alt={`Image ${image.image_id} by ${image.creator_name}`}
                      />
                    </a>
                  </Link>
                </div>
              ))}
            </Masonry>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.animemoe.us/waifu/");
  const response = await res.json();

  return { props: { response: response } };
}
