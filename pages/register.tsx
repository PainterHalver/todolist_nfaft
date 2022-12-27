import { Button, Form, Input, message, Typography } from "antd";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { motion, Variants } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties, FunctionComponent, useEffect, useState } from "react";

import { FirebaseError } from "firebase/app";
import { login, selectAuthenticated } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { CustomComponentProps } from "./_app";

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
  initial: { opacity: 0, x: 150, y: 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 150, y: 0 },
};

type RegisterErrorType = {
  username?: String;
  password?: String;
};

type RegisterData = {
  username: String;
  password: String;
  confirmPassword: String;
};

const Register: FunctionComponent<CustomComponentProps> = ({ setFromNoHeaderRoute }) => {
  const [errors, setErrors] = useState<RegisterErrorType>({});
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

  const onFinish = async (data: RegisterData) => {
    setLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        message.error("Passwords do not match!");
        return;
      }

      // Create user with email and password
      message.loading({ content: "Registering firebase account...", key: "register", duration: 60 });
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.username + process.env.NEXT_PUBLIC_EMAIL!,
        data.password as string
      );
      // Add display name to user
      await updateProfile(auth.currentUser!, { displayName: data.username as string });

      // Set state
      dispatch(login(auth.currentUser));

      message.success({ content: "Successfully registered!", key: "register" });
    } catch (error: unknown | FirebaseError) {
      console.log(error);
      if (error instanceof FirebaseError) {
        console.error(error.code, error.message);
        message.error({ content: error.message, key: "register" });
      } else {
        message.error({ content: "Failed to register! Check console for more info.", key: "register" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={variants} transition={{ type: "linear" }} style={styles.formContainer}>
      <Head>
        <title>Register</title>
      </Head>
      <Form
        name='register'
        initialValues={{ remember: true }}
        size='large'
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'>
        <Title style={{ textAlign: "center" }}>Register</Title>

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
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
          help={errors?.password}
          validateStatus={errors?.password ? "error" : ""}>
          <Input.Password onChange={() => setErrors({ ...errors, password: undefined })} />
        </Form.Item>
        <Form.Item
          label='Confirm Password'
          name='confirmPassword'
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please reenter your password!" },
            (form) => ({
              validator(_, value) {
                if (!value || form.getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
          help={errors?.password}
          validateStatus={errors?.password ? "error" : ""}>
          <Input.Password onChange={() => setErrors({ ...errors, password: undefined })} />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item>
          <Button type='primary' htmlType='submit' style={styles.submitButton} loading={loading}>
            Register
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          Or{" "}
          <Link href='/login'>
            <Typography.Link>login now!</Typography.Link>
          </Link>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Register;
