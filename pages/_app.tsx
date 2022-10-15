import type { AppProps } from "next/app";
import "../styles/globals.css";

import { Layout } from "antd";
const { Header, Content, Footer } = Layout;

import "antd/dist/antd.css";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const layoutExceptionRoutes = ["/login", "/register", "/404"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);

  return (
    <Layout>
      {shouldShowHeader && <Header>Header</Header>}
      <Content>
        <Component {...pageProps} />
      </Content>
      {shouldShowHeader && <Footer>Footer</Footer>}
    </Layout>
  );
}
