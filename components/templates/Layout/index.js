import Head from "next/head";

export default function Layout(props) {
  return (
    <div>
      <Head>
        <meta name="description" content={props.description} />
        {props.keywords && (
          <meta
            name="keywords"
            content={`anime, waifu,${props.keywords}`}
          ></meta>
        )}

        <title>{props.title}</title>
      </Head>

      {props.children}
    </div>
  );
}
