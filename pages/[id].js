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

        <div className="container mx-auto p-1 pt-3 mb-5 xl:px-32">
          {/* grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 p-1 border rounded shadow-lg">
            {/* image */}
            <div className="col-span-1 p-0 lg:p-1 lg:col-span-2">
              <div className="border rounded shadow-md p-0 bg-gray-300 overflow-hidden">
                <a
                  href={props.response.original_image}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={props.response.original_image}
                    width={props.response.width}
                    height={props.response.height}
                    quality={100}
                    layout="responsive"
                    alt={`Image ${props.response.image_id} by ${props.response.creator_name}`}
                    placeholder="blur"
                    blurDataURL={`${props.response.thumbnail}?width=${parseInt(
                      (props.response.width * 1) / 100
                    )}&height=${parseInt((props.response.height * 1) / 100)}`}
                  />
                </a>
              </div>
            </div>
            {/* end image */}
            {/* image info */}
            <div className="col-span-1 p-0 pt-1 lg:p-1">
              <div className="">
                <h2 className="text-center text-xl font-semibold">
                  {props.response.image_id}
                </h2>
                <div className="pl-2">
                  <hr className="m-1" />
                  {props.response.creator_name && (
                    <p>Creator: {props.response.creator_name}</p>
                  )}
                  <br />
                  {props.response.caption && <p>{props.response.caption}</p>}
                  <br />
                  {props.response.source && (
                    <p>
                      Source:{" "}
                      <a
                        href={props.response.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700"
                      >
                        {props.response.source}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* end image info */}
            {/* disqus */}
            <div className="col-span-1 p-0 lg:col-span-3 lg:p-1">
              <hr className="my-3" />
              <div className="container px-2">
                <Disqus data={props.response} />
              </div>
            </div>
            {/* end disqus */}
          </div>
          {/* end grid */}
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
