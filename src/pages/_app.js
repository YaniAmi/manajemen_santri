import { useRouter } from "next/router";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  } else {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}
