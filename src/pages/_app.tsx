import "../styles/globals.css";
import { Fragment } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";

function FastReadingApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Fast reading</title>
        <meta name="description" content="Read texts even faster!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </Fragment>
  );
};

export default FastReadingApp;
