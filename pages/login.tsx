import { Button, Form, Input, Typography } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const { Title } = Typography;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    height: "100%",
    padding: "2rem 0",

    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
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
};

const Login: NextPage = () => {
  const [errors, setErrors] = useState<LoginErrorType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setErrors({
        username: "Username is not correct",
        password: "Password is aaaaa",
      });
    }, 2000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={styles.container}>
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
          help={errors.username}
          validateStatus={errors.username ? "error" : ""}>
          <Input onChange={() => setErrors({ ...errors, username: undefined })} />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: "Please input your password!" }]}
          help={errors.password}
          validateStatus={errors.password ? "error" : ""}>
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
    </div>
  );
};

export default Login;
