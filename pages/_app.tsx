import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Layout, message } from "antd";
const { Header, Content, Footer } = Layout;
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import axios from "axios";
import { motion, AnimatePresence, Variants, useIsPresent, usePresence } from "framer-motion";
import { CSSProperties, useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectAuthenticated, login } from "../redux/authSlice";
import Link from "next/link";

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
  header: {
    color: "white",
    display: "flex",
    justifyContent: "end",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexGrow: 10,
    height: "100%",
    padding: "2rem 0",
  },
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <AnimatePresence mode='wait'>
        <AppLayout Component={Component} pageProps={pageProps} router={router} key={router.route} />
      </AnimatePresence>
    </Provider>
  );
}

const pageTransitionVariants: Variants = {
  initial: {},
  animate: {},
  exit: { transition: { when: "afterChildren" } },
};

function AppLayout({ Component, pageProps, router }: AppProps) {
  const { pathname } = useRouter();
  const layoutExceptionRoutes = ["/login", "/register", "/404", "/logout"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);

  const headerVariants: Variants = {
    initial: { y: shouldShowHeader ? -100 : "-100%", display: shouldShowHeader ? "" : "none" },
    animate: {
      y: shouldShowHeader ? 0 : "-100%",
      transitionEnd: { display: shouldShowHeader ? "" : "none" },
    },
    exit: {
      y: shouldShowHeader ? -100 : "-100%",
      opacity: 0,
      transitionEnd: { display: shouldShowHeader ? "" : "none" },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    (async () => {
      try {
        if (!authenticated) {
          const res = await axios.get("/auth/me");
          dispatch(login(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <motion.div initial='initial' animate='animate' exit='exit' variants={pageTransitionVariants}>
      <Layout style={styles.layout}>
        {/* {shouldShowHeader && ( */}
        <motion.div variants={headerVariants} transition={{ type: "linear" }} key='motion-header'>
          <Header style={styles.header}>
            {authenticated ? (
              <Link href='/logout'>
                <a style={{ color: "white" }}>Logout</a>
              </Link>
            ) : (
              <div>
                <Link href='/login'>
                  <a style={{ color: "white" }}>Login</a>
                </Link>
                <Link href={"/register"} style={{ color: "white" }}>
                  <a style={{ color: "white", marginLeft: ".5rem" }}>Register</a>
                </Link>
              </div>
            )}
            <Link href={"/ssred"} style={{ color: "white" }}>
              <a style={{ color: "white", marginLeft: ".5rem" }}>Ssred</a>
            </Link>
          </Header>
        </motion.div>
        {/* )} */}
        <Content style={styles.container}>
          <Component {...pageProps} />
        </Content>
        {shouldShowHeader && <Footer>Footer</Footer>}
      </Layout>
    </motion.div>
  );
}
