import { Button, Form, Input, Typography, message } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import axios, { AxiosError } from "axios";

const { Title } = Typography;

const styles: { [key: string]: CSSProperties } = {
  form: {
    backgroundColor: "white",
    padding: "2rem",
    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)",
    height: "fit-content",
    maxWidth: "600px",
    width: "100%",
  },
  submitButton: {
    width: "100%",
    marginTop: "1rem",
  },
};

type LoginErrorType = {
  username?: String;
  password?: String;
  general?: String;
};

type LoginData = {
  username: String;
  password: String;
};

const Login: NextPage = () => {
  const [errors, setErrors] = useState<LoginErrorType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (data: LoginData) => {
    message.loading({ content: "Loading...", key: "login" });
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", data);
      message.success({ content: "Successfully logged in!", key: "login" });
      console.log(res);
    } catch (error: unknown | AxiosError) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.errors);
      }
      message.error({ content: errors.general || "Failed to login!", key: "login" });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name='login'
      initialValues={{ remember: true }}
      size='large'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
      layout='vertical'
      style={styles.form}>
      <Title style={{ textAlign: "center" }}>Login</Title>
      <Form.Item
        label='Username'
        name='username'
        rules={[{ required: true, message: "Please input your username!" }]}
        help={errors?.username}
        validateStatus={errors?.username ? "error" : ""}>
        <Input onChange={() => setErrors({ ...errors, username: undefined })} />
      </Form.Item>

      <Form.Item
        label='Password'
        name='password'
        rules={[{ required: true, message: "Please input your password!" }]}
        help={errors?.password}
        validateStatus={errors?.password ? "error" : ""}>
        <Input.Password onChange={() => setErrors({ ...errors, password: undefined })} />
      </Form.Item>

      {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

      <Form.Item>
        <Button type='primary' htmlType='submit' style={styles.submitButton} loading={loading}>
          Login
        </Button>
      </Form.Item>
      <Form.Item style={{ textAlign: "right" }}>
        Or <Link href='/register'>register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
