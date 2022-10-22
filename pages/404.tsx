import { Typography } from "antd";

const styles = {
  title: {
    color: "white",
    display: "block",
    margin: "0.5rem",
    fontSize: "3rem",
  },
};

export default function ErrorPage() {
  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title style={styles.title}>404</Typography.Title>
      <Typography.Title style={styles.title}>You&apos;re stepping into the unknown.</Typography.Title>
    </div>
  );
}
