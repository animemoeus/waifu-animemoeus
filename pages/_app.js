import Router from "next/router";
import NProgress from "nprogress";

import "../styles/custom.css";
import "../styles/nprogress.css";
import "bootstrap/dist/css/bootstrap.min.css";

// nprogress loading
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
