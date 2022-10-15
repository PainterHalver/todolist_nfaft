import type { NextPage } from "next";
import { Button } from "antd";
import { useState } from "react";

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <Button loading={loading} type="primary">
        Hello
      </Button>
    </div>
  );
};

export default Home;
