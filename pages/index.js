import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";

import { Navbar } from "../components/molecules";

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
    <div>
      <Navbar />

      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading...</h4>}
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
                className="card  border-0 rounded-0"
                style={{ width: "100%" }}
              >
                <img src={image.thumbnail} className=" shadow-sm" />
              </div>
            ))}
          </Masonry>
        </div>
      </InfiniteScroll>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://api.animemoe.us/images/");
  const response = await res.json();

  return { props: { images: response.results } };
}
