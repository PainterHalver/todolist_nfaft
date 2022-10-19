import type { NextPage } from "next";
import { DatePicker, message, Alert } from "antd";
import { useState } from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<any>(null);
  const handleChange = (value: any) => {
    message.info(`Selected Date: ${value ? value.format("YYYY-MM-DD") : "None"}`);
    setDate(value);
  };
  const isPresent = useIsPresent();

  return (
    <div style={{ width: 400, margin: "100px auto" }}>
      <div>IndexPage</div>
    </div>
  );
};

export default Home;
