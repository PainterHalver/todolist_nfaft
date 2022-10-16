import type { NextPage } from "next";
import { DatePicker, message, Alert } from "antd";
import { useState } from "react";

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<any>(null);
  const handleChange = (value: any) => {
    message.info(`Selected Date: ${value ? value.format("YYYY-MM-DD") : "None"}`);
    setDate(value);
  };

  return <div style={{ width: 400, margin: "100px auto" }}></div>;
};

export default Home;
