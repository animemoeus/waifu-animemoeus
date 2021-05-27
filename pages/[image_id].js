import Error from "next/error";
import { DiscussionEmbed } from "disqus-react";

import { Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Detail(props) {
  if (props.status !== 200) {
    return <Error statusCode={props.status} />;
  }

  const disqusConfig = {
    url: `https:waifu.animemoe.us/${props.image.image_id}`,
    identifier: props.image.image_id, // Single post id
    title: `${props.image.image_id} | AnimeMoeUs`, // Single post title
  };

  return (
    <Layout title={`${props.image.image_id} | AnimeMoeUs`}>
      <div style={{ minHeight: "100vh" }}>
        <Navbar />

        <div className="container-md p-1 mt-3">
          <div className="container-fluid border rounded bg-white mb-3">
            <div className="row">
              <div className="col-lg-8 p-1">
                <img
                  src={props.image.original_image}
                  className="border rounded shadow-sm"
                  style={{ width: "100%" }}
                  alt="..."
                />
              </div>
              <div className="col-lg-4 pt-2">
                <p className="text-center fs-4">{props.image.image_id}</p>
                <hr className="m-0" />
                <p className="text-muted">
                  <small>By {props.image.posted_by}</small>
                </p>
                <p>Artist: {props.image.artist_name}</p>
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
              <DiscussionEmbed
                shortname="waifu-animemoeus"
                config={disqusConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.animemoe.us/images/${params.image_id}/`);
  const response = await res.json();

  return { props: { status: res.status, image: response } };
}
