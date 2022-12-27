import { Button, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, Variants } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
  username?: string;
  password?: string;
  general?: string;
};

type LoginData = {
  username: string;
  password: string;
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
  }, [authenticated, setFromNoHeaderRoute, router]);

  const onFinish = async (data: LoginData) => {
    setLoading(true);
    try {
      // Sign in firebase
      message.loading({ content: "Signing in firebase...", key: "login", duration: 60 });
      const auth = getAuth();
      const email = data.username + process.env.NEXT_PUBLIC_EMAIL;
      const userCredentials = await signInWithEmailAndPassword(auth, email, data.password);

      // Set state
      dispatch(login(auth.currentUser));

      message.success({ content: "Successfully logged in!", key: "login" });
    } catch (error: unknown | FirebaseError) {
      console.log(error);
      if (error instanceof FirebaseError) {
        console.error(error.code, error.message);
        message.error({ content: error.message, key: "login" });
      } else {
        message.error({ content: "Failed to login! Check console for more info.", key: "login" });
      }
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
            <Typography.Link>register now!</Typography.Link>
          </Link>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Login;
