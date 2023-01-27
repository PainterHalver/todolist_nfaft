import GithubOutlined from "@ant-design/icons/lib/icons/GithubOutlined";
import { Button, Layout, message, Typography } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, LayoutGroup, motion, Variants } from "framer-motion";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import { Provider } from "react-redux";
const { Header, Content, Footer } = Layout;

import "antd/dist/antd.css";
import "../styles/globals.css";

import { GLOBAL_USERNAME } from "../lib/constants";
import { app } from "../lib/firebase";
import { login, logout, selectAuthenticated, selectUser } from "../redux/authSlice";
import store, { useAppDispatch, useAppSelector } from "../redux/store";

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
  icon: {
    fontSize: "1.3rem",
    marginLeft: "0.3rem",
    position: "relative",
    top: "0.1rem",
  },
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <LayoutGroup>
        <AnimatePresence mode='wait'>
          <AppLayout Component={Component} pageProps={pageProps} router={router} key={router.route} />
        </AnimatePresence>
      </LayoutGroup>
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
  const layoutExceptionRoutes = ["/login", "/register"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);
  const user = useAppSelector(selectUser);
  const [fromNoHeaderRoute, setFromNoHeaderRoute] = useState(false);

  const logMeOut = async () => {
    dispatch(logout());
    try {
      message.loading({ content: "Logging out of Firebase...", key: "logout", duration: 60 });
      // Sign out of Firebase
      const auth = getAuth(app);
      await auth.signOut();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

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
    const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        dispatch(login(user));
      } else {
        // User is signed out
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div initial='initial' animate='animate' exit='exit' variants={pageTransitionVariants}>
      <Layout style={styles.layout}>
        <motion.div variants={headerVariants} transition={{ type: "tween" }}>
          <Header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={{ marginRight: "auto", display: "flex", alignItems: "center" }}>
                <Typography style={{ color: "white", fontSize: "1rem" }}>
                  Hello {authenticated ? user?.displayName : GLOBAL_USERNAME}, UID: {user ? user.uid : "No auth"}
                </Typography>
              </div>
              {authenticated ? (
                <div>
                  <Button danger onClick={logMeOut}>
                    Logout
                  </Button>
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
        <Content style={styles.contentContainer}>
          <Component {...pageProps} setFromNoHeaderRoute={setFromNoHeaderRoute} />
        </Content>
        <motion.div variants={footerVariants} transition={{ type: "tween" }}>
          <Footer style={styles.footer}>
            <motion.div layout>
              © 2022 PainterHalver. All Rights Reserved.{" "}
              <a
                target='_blank'
                href='https://github.com/PainterHalver/todolist_nfaft'
                rel='noopener noreferrer'
                style={styles.icon}>
                <GithubOutlined />
              </a>
            </motion.div>
          </Footer>
        </motion.div>
      </Layout>
    </motion.div>
  );
}
