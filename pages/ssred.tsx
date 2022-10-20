import { GetServerSideProps } from "next";
import { Typography } from "antd";
import Link from "next/link";

const { Text } = Typography;

type SSRProps = {
  name: String;
  color: String;
  data: any;
};

export default function ssred({ name, color, data }: SSRProps) {
  console.log(data);

  return (
    <div>
      <Text code>{name}</Text>
      <Text mark>{name}</Text>
      <Text keyboard>{color}</Text>
      <Text mark>{data.toString()}</Text>
      <Link href={"/"}>Index</Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SSRProps> = async () => {
  const res = await fetch("http://127.0.0.1:3000/api/hello");
  const data = await res.json();

  return {
    props: {
      name: "ssred",
      color: "red",
      data,
    },
    notFound: false,
  };
};
