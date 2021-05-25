import Image from "next/image";
import Masonry from "react-masonry-css";

import { Navbar } from "../components/molecules";

export default function Home(props) {
  return (
    <div>
      <Navbar />

      <div className="container-fluid mt-3">
        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {props.images.results.map((image) => (
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
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://api.animemoe.us/images/");
  const response = await res.json();

  return { props: { images: response } };
}
