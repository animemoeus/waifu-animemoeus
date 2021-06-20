import Error from "next/error";
import Image from "next/image";

import { Disqus, Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Detail(props) {
  if (props.status !== 200) {
    return <Error statusCode={props.status} />;
  }

  return (
    <Layout
      title={`${props.image.image_id} | AnimeMoeUs Waifu`}
      description={`Waifu ${props.image.image_id} by ${props.image.creator_name}`}
      keywords={`${props.image.creator_name}, ${props.image.creator_username}, ${props.image.image_id}`}
    >
      <div style={{ minHeight: "100vh" }}>
        <Navbar />

        <div className="container-sm p-1 mt-3">
          <div className="container-fluid border rounded shadow bg-white mb-3">
            <div className="row">
              <div className="col-lg-7 p-1">
                <div
                  className="grumpy-image-wrapper bg-light"
                  style={{
                    paddingBottom: `${
                      (props.image.height / props.image.width) * 100
                    }%`,
                  }}
                >
                  <Image
                    src={props.image.original_image}
                    layout={"fill"}
                    quality={100}
                    alt={`Image ${props.image.image_id} by ${props.image.creator_name}`}
                    className="border rounded shadow"
                  />
                </div>
              </div>
              <div className="col-lg-5 pt-2">
                <p className="text-center fs-4">{props.image.image_id}</p>
                <hr />
                <p>Artist: {props.image.creator_name}</p>
                <p>{props.image.caption}</p>
                <p>
                  Source:{" "}
                  <a
                    href={props.image.source}
                    className="text-decoration-none"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.image.source}
                  </a>
                </p>
              </div>
            </div>
            <hr />
            <div>
              <Disqus image={props.image} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.animemoe.us/waifu/${params.image_id}/`);
  const response = await res.json();

  return { props: { status: res.status, image: response } };
}
