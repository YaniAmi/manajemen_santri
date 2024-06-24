import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* jika untuk semua page maka taruh disini */}
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
