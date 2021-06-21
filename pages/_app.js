import Router from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import { useState } from "react";

import "../styles/custom.css";
import "animate.css/animate.min.css";
import "../styles/nprogress.css";

// nprogress loading
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const [images, setImages] = useState([]);
  const [pageNow, setPageNow] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
        crossOrigin="anonymous"
      />

      <Component
        {...pageProps}
        images={images}
        setImages={setImages}
        pageNow={pageNow}
        setPageNow={setPageNow}
        scrollPosition={scrollPosition}
        setScrollPosition={setScrollPosition}
      />
    </>
  );
}

export default MyApp;
