import Image from "next/image";
import { notFound } from "next/navigation"; // Import for error handling
import Navbar from "../components/molecules/Navbar/Navbar";
import Disqus from "../components/molecules/Disqus/Disqus";

export default async function Detail({ params }) {
  const res = await fetch(`https://api.animemoe.us/waifu/${params.id}/`);
  if (!res.ok) {
    return notFound(); // Handle 404 or other non-200 responses
  }
  const response = await res.json();
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
                <a
                  href={`${response.original_image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`${response.original_image}`}
                    width={response.width}
                    height={response.height}
                    quality={100}
                    alt={`Image ${response.image_id} by ${response.creator_name}`}
                    placeholder="blur"
                    blurDataURL={`${response.thumbnail}?width=${parseInt(
                      (response.width * 1) / 100
                    )}&height=${parseInt((response.height * 1) / 100)}`}
                    className="border rounded shadow-sm"
                  />
                </a>
              </div>
            </div>
            <div className="col-md-5 p-0">
              <div className="p-1 pt-2">
                <div className="text-center">
                  <h2>{response.image_id}</h2>
                </div>
                <hr />
                <div className="px-3">
                  <p>Creator: {response.creator_name}</p>
                  <p>{response.caption}</p>
                  <p>
                    Source:{" "}
                    <a
                      href={response.source}
                      className="text-decoration-none"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {response.source}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr className="m-0" />
          <div className="p-2">
          <Disqus data={response} />
          </div>
        </div>
      </div>
    </div>
  );
}
