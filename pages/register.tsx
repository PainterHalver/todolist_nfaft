import { Button, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useRouter } from "next/router";
import { selectAuthenticated, login } from "../redux/authSlice";
import { AnimatePresence, motion, Variants } from "framer-motion";
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
  }, [authenticated]);

  const onFinish = async (data: RegisterData) => {
    message.loading({ content: "Loading...", key: "register" });
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", data);

      // Set state
      dispatch(login(res.data.user));

      // Set JWT
      localStorage.setItem("token", res.data.token);

      // Set firebase token
      localStorage.setItem("firebaseToken", res.data.firebaseToken);

      message.success({ content: "Successfully registed!", key: "register" });
      console.log(res);
    } catch (error: unknown | AxiosError) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.errors);
      }
      message.error({ content: "Failed to register!", key: "register" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={variants} transition={{ type: "linear" }} style={styles.formContainer}>
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
          rules={[{ required: true, message: "Please input your password!" }]}
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
            <a>login now!</a>
          </Link>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Register;
