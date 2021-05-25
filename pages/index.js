import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import "animate.css/animate.min.css";

import { Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Home(props) {
  const [images, setImages] = useState(props.images);
  const [hasMore, setHasMore] = useState(true);
  const [pageNow, setPageNow] = useState(2);

  const fetchMoreData = () => {
    fetch(`https://api.animemoe.us/images/?page=${pageNow}`)
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
    <Layout title="Waifu | AnimeMoeUs">
      <div>
        <Navbar />

        <InfiniteScroll
          dataLength={images.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p className="text-center fs-3">Loading...</p>}
        >
          <div className="container-fluid mt-3">
            <Masonry
              breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="card  border-0 rounded-0 animate__animated animate__fadeInUp"
                  style={{ width: "100%" }}
                >
                  <img src={image.thumbnail} className="shadow-sm" />
                </div>
              ))}
            </Masonry>
          </div>
        </InfiniteScroll>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://api.animemoe.us/images/");
  const response = await res.json();

  return { props: { images: response.results } };
}
