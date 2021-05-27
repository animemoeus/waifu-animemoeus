import Error from "next/error";

import { Disqus, Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Detail(props) {
  if (props.status !== 200) {
    return <Error statusCode={props.status} />;
  }

  return (
    <Layout title={`${props.image.image_id} | AnimeMoeUs`}>
      <div style={{ minHeight: "100vh" }}>
        <Navbar />

        <div className="container-md p-1 mt-3">
          <div className="container-fluid border rounded shadow bg-white mb-3">
            <div className="row">
              <div className="col-lg-7 p-1">
                <img
                  src={props.image.original_image}
                  className="border rounded shadow-sm"
                  style={{ width: "100%" }}
                  alt="..."
                />
              </div>
              <div className="col-lg-5 pt-2">
                <p className="text-center fs-4">{props.image.image_id}</p>
                <hr />
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
            <hr className="mb-0" />
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
  const res = await fetch(`https://api.animemoe.us/images/${params.image_id}/`);
  const response = await res.json();

  return { props: { status: res.status, image: response } };
}
