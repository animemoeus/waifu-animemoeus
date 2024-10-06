import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../components/molecules/Navbar/Navbar";
import Disqus from "../components/molecules/Disqus/Disqus";

export default async function Detail({ params }) {
  const res = await fetch(`https://api.animemoe.us/waifu/${params.id}/`);
  if (!res.ok) {
    return notFound();
  }
  const response = await res.json();

  return (
    <div className="min-h-screen d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1 container-fluid p-2">
        <div className="row h-100">
          <div className="col-lg-8 mb-3 mb-lg-0">
            <div className="h-100 d-flex flex-column">
              <a
                href={response.original_image}
                target="_blank"
                rel="noreferrer"
                className="flex-grow-1 d-flex align-items-center justify-content-center bg-light rounded"
              >
                <Image
                  src={response.original_image}
                  width={response.width}
                  height={response.height}
                  quality={100}
                  alt={`Image ${response.image_id} by ${response.creator_name}`}
                  placeholder="blur"
                  blurDataURL={`${response.thumbnail}?width=${parseInt(
                    (response.width * 1) / 100
                  )}&height=${parseInt((response.height * 1) / 100)}`}
                  className="img-fluid rounded"
                  style={{ objectFit: "contain", maxHeight: "100%" }}
                />
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-light p-3 rounded h-100">
              <h2 className="text-center mb-3">{response.image_id}</h2>
              <hr />
              <p>
                <strong>Creator:</strong> {response.creator_name}
              </p>
              <p>{response.caption}</p>
              <p>
                <strong>Source:</strong>{" "}
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
        <div className="row mt-3">
          <div className="col-12">
            <Disqus data={response} />
          </div>
        </div>
      </div>
    </div>
  );
}
