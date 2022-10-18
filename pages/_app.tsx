import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Layout, message } from "antd";
const { Header, Content, Footer } = Layout;
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CSSProperties } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

message.config({
  duration: 2,
});

const styles: { [key: string]: CSSProperties } = {
  layout: {
    minHeight: "100vh",
    overflowX: "hidden",

    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    height: "100%",
    padding: "2rem 0",
  },
};

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 200, y: 0 },
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const { pathname } = useRouter();
  const layoutExceptionRoutes = ["/login", "/register", "/404"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);

  return (
    <Layout style={styles.layout}>
      {shouldShowHeader && <Header>Header</Header>}
      <AnimatePresence mode='wait'>
        <motion.div
          key={router.route}
          variants={variants}
          initial='hidden'
          animate='enter'
          exit='exit'
          transition={{ type: "linear" }}
          className=''>
          <Content style={styles.container}>
            <Component {...pageProps} />
          </Content>
        </motion.div>
      </AnimatePresence>
      {shouldShowHeader && <Footer>Footer</Footer>}
    </Layout>
  );
}
