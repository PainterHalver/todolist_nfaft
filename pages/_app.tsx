import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Layout, message } from "antd";
const { Header, Content, Footer } = Layout;
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import axios from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CSSProperties, useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectAuthenticated, login } from "../redux/authSlice";

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

const variants: { [key: string]: Variants } = {
  default: {
    hidden: { opacity: 0, x: 0, y: 100 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  },
  "/login": {
    hidden: { opacity: 0, x: -150, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -150, y: 0 },
  },
  "/register": {
    hidden: { opacity: 0, x: 150, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 150, y: 0 },
  },
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <AppLayout Component={Component} pageProps={pageProps} router={router} />
    </Provider>
  );
}

function AppLayout({ Component, pageProps, router }: AppProps) {
  const { pathname } = useRouter();
  const layoutExceptionRoutes = ["/login", "/register", "/404"];
  const shouldShowHeader = !layoutExceptionRoutes.includes(pathname);
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);

  // TODO: Fetch user data when the app (re)loads
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
    <Layout style={styles.layout}>
      {shouldShowHeader && <Header>Header</Header>}
      <AnimatePresence mode='wait'>
        <motion.div
          key={router.route}
          variants={variants[router.route || "default"]}
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
