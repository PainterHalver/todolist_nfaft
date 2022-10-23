import { Button, Typography } from "antd";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  title: {
    color: "white",
    display: "block",
    margin: "0.5rem",
    fontSize: "3rem",
  },
  btnGoHome: {
    marginTop: "2rem",
  },
};

const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ErrorPage() {
  return (
    <motion.div variants={variants} style={{ textAlign: "center" }}>
      <Typography.Title style={styles.title}>404</Typography.Title>
      <Typography.Title style={styles.title}>You&apos;re stepping into the unknown.</Typography.Title>
      <Link href={"/"}>
        <Button type='primary' style={styles.btnGoHome}>
          Go home
        </Button>
      </Link>
    </motion.div>
  );
}
