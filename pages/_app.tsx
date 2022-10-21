import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Button, Layout, message } from "antd";
const { Header, Content, Footer } = Layout;
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import axios from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CSSProperties, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectAuthenticated, login } from "../redux/authSlice";
import Link from "next/link";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

message.config({
  duration: 2,
});

const styles: { [key: string]: CSSProperties | { [key: string]: CSSProperties } } = {
  layout: {
    minHeight: "100vh",
    overflowX: "hidden",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f5ede555",
    padding: "0 1rem",
  },
  headerContent: {
    display: "flex",
    justifyContent: "end",
    maxWidth: "800px",
    width: "100%",
    padding: "0 1rem",
  },
  contentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 10,
    minHeight: "400px",
    // height: "1px",
    padding: "1rem 1rem",
  },
  footer: {
    backgroundColor: "transparent",
    color: "white",
    textAlign: "center",
    opacity: 0.7,
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

export type CustomComponentProps = {
  setFromNoHeaderRoute: React.Dispatch<React.SetStateAction<boolean>>;
};

function AppLayout({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const layoutExceptionRoutes = ["/login", "/register", "/404", "/logout"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);
  const [fromNoHeaderRoute, setFromNoHeaderRoute] = useState(false);

  const headerVariants: Variants = {
    initial: { y: shouldShowHeader ? -100 : "-100%", display: shouldShowHeader ? "block" : "none" },
    animate: { y: shouldShowHeader ? 0 : "-100%" },
    exit: {
      y: shouldShowHeader ? -100 : "-100%",
      display: fromNoHeaderRoute ? "none" : "block",
      transitionEnd: { display: shouldShowHeader ? "block" : "none" },
    },
  };

  const footerVariants: Variants = {
    initial: { y: shouldShowHeader ? 100 : "100%", display: shouldShowHeader ? "block" : "none" },
    animate: { y: shouldShowHeader ? 0 : "100%" },
    exit: {
      y: shouldShowHeader ? 100 : "100%",
      display: fromNoHeaderRoute ? "none" : "block",
      transitionEnd: { display: shouldShowHeader ? "block" : "none" },
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
        <motion.div variants={headerVariants} transition={{ type: "tween" }}>
          <Header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={{ marginRight: "auto" }}>
                <Link href={"/ssred"}>
                  <Button>Ssred</Button>
                </Link>
              </div>
              {authenticated ? (
                <div>
                  <Link href='/logout'>
                    <Button danger>Logout</Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link href='/login'>
                    <Button type='primary'>Login</Button>
                  </Link>
                  <Link href={"/register"}>
                    <Button type='default' style={{ marginLeft: "1rem" }}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Header>
        </motion.div>
        {/* )} */}
        <Content style={styles.contentContainer}>
          <Component {...pageProps} setFromNoHeaderRoute={setFromNoHeaderRoute} />
        </Content>
        <motion.div variants={footerVariants} transition={{ type: "tween" }}>
          <Footer style={styles.footer}>© 2022 PainterHalver. All Rights Reserved.</Footer>
        </motion.div>
      </Layout>
    </motion.div>
  );
}
