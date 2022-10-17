import { Typography } from "antd";
import { CSSProperties } from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    height: "100%",
    padding: "2rem 0",
    flexDirection: "column",

    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  title: {
    color: "white",
    display: "block",
    margin: "0.5rem",
    fontSize: "3rem",
  },
};

export default function ErrorPage() {
  return (
    <div style={styles.container as CSSProperties}>
      <Typography.Title style={styles.title}>404</Typography.Title>
      <Typography.Title style={styles.title}>You're stepping into the unknown.</Typography.Title>
    </div>
  );
}
