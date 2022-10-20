import { motion, Variants } from "framer-motion";
import { CSSProperties, FunctionComponent } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
    maxWidth: "800px",
    width: "100%",

    // minHeight: "80vh",
    height: "100%",
    padding: "1rem 1rem",

    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)",
  },
};

const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
  exit: { opacity: 0 },
};

const Home: FunctionComponent = () => {
  return (
    <motion.div variants={variants} transition={{ type: "linear" }} style={styles.container}>
      <div>IndexPage</div>
    </motion.div>
  );
};

export default Home;
