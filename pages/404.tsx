import { Typography } from "antd";
import { CSSProperties } from "react";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
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

export default function ErrorPage(props: any) {
  return (
    <div style={styles.container as CSSProperties}>
      <Typography.Title style={styles.title}>404</Typography.Title>
      <Typography.Title style={styles.title}>You're stepping into the unknown.</Typography.Title>
    </div>
  );
}
