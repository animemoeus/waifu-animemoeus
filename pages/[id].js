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
      <div className="min-h-screen">
        <Navbar />

        <div
          className="container-fluid p-0 m-0 pt-2 p-1"
          style={{ minHeight: "90.8vh" }}
        >
          <div
            className="container-md border rounded shadow mb-2"
            style={{ maxHeight: "100%" }}
          >
            <div className="row" style={{ maxHeight: "100%" }}>
              <div className="col-md-7 p-0" style={{ maxHeight: "100%" }}>
                <div className="p-1">
                  <a
                    href={props.response.original_image}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={`https://api.animemoe.us/discord/refresh/?url=${props.response.original_image}`}
                      width={props.response.width}
                      height={props.response.height}
                      quality={100}
                      layout="responsive"
                      alt={`Image ${props.response.image_id} by ${props.response.creator_name}`}
                      placeholder="blur"
                      blurDataURL={`https://api.animemoe.us/discord/refresh/?url=${props.response.thumbnail
                        }?width=${parseInt(
                          (props.response.width * 1) / 100
                        )}&height=${parseInt((props.response.height * 1) / 100)}`}
                      className="border rounded shadow-sm"
                    />
                  </a>
                </div>
              </div>
              <div className="col-md-5 p-0">
                <div className="p-1 pt-2">
                  <div className="text-center">
                    <h2>{props.response.image_id} </h2>
                  </div>
                  <hr />

                  <div className="px-3">
                    <p>Creator: {props.response.creator_name}</p>
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
              </div>
            </div>
            <hr className="m-0" />
            <div className="p-2">
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
