import Router from "next/router";
import NProgress from "nprogress";
import { useState } from "react";

import "tailwindcss/tailwind.css";
import "../styles/custom.css";
import "../styles/nprogress.css";

// nprogress loading
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
