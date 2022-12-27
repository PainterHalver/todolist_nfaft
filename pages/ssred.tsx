import { Typography } from "antd";
import { GetServerSideProps } from "next";
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
      <Text code>This route is SSRed</Text>
      <Text code>{name}</Text>
      <Text mark>{name}</Text>
      <Text keyboard>{color}</Text>
      <Text mark>Data from api: {JSON.stringify(data)}</Text>
      <Link href={"/"}>Index</Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SSRProps> = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/hello");
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
