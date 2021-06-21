import Error from "next/error";
import Image from "next/image";

import { Disqus, Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Detail(props) {
  if (props.statusCode !== 200) {
    return <Error statusCode={props.statusCode} />;
  }

  return (
    <Layout
      title={`${props.response.image_id} | AnimeMoeUs Waifu`}
      description={`Waifu ${props.response.image_id} by ${props.response.creator_name}`}
      keywords={`${props.response.creator_name}, ${props.response.creator_username}, ${props.response.image_id}, animemoeus, waifu animemoeus`}
    >
      <div style={{ minHeight: "100vh" }}>
        <Navbar />

        <div className="container-sm p-1 mt-3">
          <div className="container-fluid border rounded shadow bg-white mb-3">
            <div className="row">
              <div className="col-lg-7 p-1">
                <div
                  className="grumpy-image-wrapper bg-light rounded"
                  style={{
                    paddingBottom: `${
                      (props.response.height / props.response.width) * 100
                    }%`,
                  }}
                >
                  <Image
                    src={props.response.original_image}
                    layout={"fill"}
                    quality={100}
                    alt={`Image ${props.response.image_id} by ${props.response.creator_name}`}
                    className="border rounded shadow"
                  />
                </div>
              </div>
              <div className="col-lg-5 pt-2">
                <p className="text-center fs-4">{props.response.image_id}</p>
                <hr />
                <p>Artist: {props.response.creator_name}</p>
                <p>{props.response.caption}</p>
                <p>
                  Source:{" "}
                  <a
                    href={props.response.source}
                    className="text-decoration-none"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.response.source}
                  </a>
                </p>
              </div>
            </div>
            <hr />
            <div>
              <Disqus data={props.response} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.animemoe.us/waifu/${params.id}/`);
  const response = await res.json();

  return { props: { statusCode: res.status, response: response } };
}
