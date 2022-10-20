import { motion } from "framer-motion";
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

    minHeight: "80vh",
    height: "100%",
    padding: "1rem 1rem",

    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)",
  },
};

const Home: FunctionComponent = () => {
  return (
    <motion.div style={styles.container}>
      <div>IndexPage</div>
    </motion.div>
  );
};

export default Home;
