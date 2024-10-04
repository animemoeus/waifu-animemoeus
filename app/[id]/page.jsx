import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../components/molecules/Navbar/Navbar";
import Disqus from "disqus-react";

async function getWaifuData(id) {
  try {
    const res = await fetch(`https://api.animemoe.us/waifu/${id}/`);
    if (!res.ok) {
      console.error("Error fetching waifu data:", res.statusText);
      return { props: { statusCode: res.status } };
    }
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { props: { statusCode: 500 } };
  }
}

export async function generateMetadata({ params }) {
  const waifu = await getWaifuData(params.id);
  
  return {
    title: `${waifu.image_id} | AnimeMoeUs Waifu`,
    description: `Waifu ${waifu.image_id} by ${waifu.creator_name}`,
    keywords: `${waifu.creator_name}, ${waifu.creator_username}, ${waifu.image_id}, animemoeus, waifu animemoeus`,
  };
}

export default async function Detail({ params }) {
  const waifu = await getWaifuData(params.id);

  if (waifu.statusCode !== 200) {
    notFound();
  }

  return (
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
                <a href={waifu.original_image} target="_blank" rel="noreferrer">
                  <Image
                    src={waifu.original_image}
                    width={waifu.width}
                    height={waifu.height}
                    quality={100}
                    alt={`Image ${waifu.image_id} by ${waifu.creator_name}`}
                    placeholder="blur"
                    blurDataURL={`${waifu.thumbnail}?width=${parseInt(
                      (waifu.width * 1) / 100
                    )}&height=${parseInt((waifu.height * 1) / 100)}`}
                    className="border rounded shadow-sm"
                  />
                </a>
              </div>
            </div>
            <div className="col-md-5 p-0">
              <div className="p-1 pt-2">
                <div className="text-center">
                  <h2>{waifu.image_id}</h2>
                </div>
                <hr />
                <div className="px-3">
                  <p>Creator: {waifu.creator_name}</p>
                  <p>{waifu.caption}</p>
                  <p>
                    Source:{" "}
                    <a
                      href={waifu.source}
                      className="text-decoration-none"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {waifu.source}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr className="m-0" />
          <div className="p-2">
            <Disqus data={waifu} />
          </div>
        </div>
      </div>
    </div>
  );
}
