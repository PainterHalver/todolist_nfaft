import { Button, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { motion, Variants } from "framer-motion";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Head from "next/head";

import { CustomComponentProps } from "./_app";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectAuthenticated, login } from "../redux/authSlice";

const { Title } = Typography;

const styles: { [key: string]: CSSProperties } = {
  formContainer: {
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

const variants: Variants = {
  initial: { opacity: 0, x: -150, y: 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -150, y: 0 },
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

const Login: FunctionComponent<CustomComponentProps> = ({ setFromNoHeaderRoute }) => {
  const [errors, setErrors] = useState<LoginErrorType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);
  const router = useRouter();

  // If user is already authenticated, redirect to home page
  useEffect(() => {
    // Set animation header
    setFromNoHeaderRoute(true);

    if (authenticated) {
      router.push("/");
    }
  }, [authenticated]);

  const onFinish = async (data: LoginData) => {
    setLoading(true);
    try {
      // Login user and get token
      message.loading({ content: "Signing in server...", key: "login", duration: 60 });
      const res = await axios.post("/auth/login", data);

      // Sign in firebase
      message.loading({ content: "Signing in firebase...", key: "login", duration: 60 });
      const auth = getAuth();
      const userCredentials = await signInWithCustomToken(auth, res.data.firebaseToken);
      console.log({ userCredentials });

      // Set state
      dispatch(login(res.data.user));

      // Set JWT
      localStorage.setItem("token", res.data.token);

      // Set firebase token
      localStorage.setItem("firebaseToken", res.data.firebaseToken);

      message.success({ content: "Successfully logged in!", key: "login" });
      console.log(res);
    } catch (error: unknown | AxiosError | FirebaseError) {
      console.log(error);

      // FIXME: errors.general is undefined because setErrors is not effective immediately
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
    <motion.div variants={variants} transition={{ type: "linear" }} style={styles.formContainer}>
      <Head>
        <title>Login</title>
      </Head>
      <Form
        name='login'
        initialValues={{ remember: true }}
        size='large'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'>
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
          Or{" "}
          <Link href='/register'>
            <a>register now!</a>
          </Link>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Login;
