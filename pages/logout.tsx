import { Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { logout } from "../redux/authSlice";

const styles = {
  title: {
    color: "white",
    display: "block",
    margin: "0.5rem",
    fontSize: "3rem",
  },
};

export default function Logout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/");
  });

  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title style={styles.title}>Logging out...</Typography.Title>
      <Typography.Title style={styles.title}>Nothing to see here</Typography.Title>
    </div>
  );
}
