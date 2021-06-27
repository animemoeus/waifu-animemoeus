import Router from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import { useState } from "react";

import "animate.css/animate.min.css";
import "tailwindcss/tailwind.css";
import "../styles/custom.css";
import "../styles/nprogress.css";

// nprogress loading
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const [images, setImages] = useState([]);
  const [pageNow, setPageNow] = useState(1);

  return (
    <Component
      {...pageProps}
      images={images}
      setImages={setImages}
      pageNow={pageNow}
      setPageNow={setPageNow}
    />
  );
}

export default MyApp;
