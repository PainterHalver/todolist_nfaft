import { Button, Form, Input, Typography, message } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useRouter } from "next/router";
import { selectAuthenticated, login } from "../redux/authSlice";

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

type RegisterErrorType = {
  email?: String;
  username?: String;
  password?: String;
};

type RegisterData = {
  email: String;
  username: String;
  password: String;
  confirmPassword: String;
};

const Register: NextPage = () => {
  const [errors, setErrors] = useState<RegisterErrorType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectAuthenticated);
  const router = useRouter();

  // If user is already authenticated, redirect to home page
  useEffect(() => {
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
    <Form
      name='register'
      initialValues={{ remember: true }}
      size='large'
      onFinish={onFinish}
      autoComplete='off'
      layout='vertical'
      style={styles.form}>
      <Title style={{ textAlign: "center" }}>Register</Title>
      <Form.Item
        label='Email'
        name='email'
        rules={[
          { required: true, message: "Please input your email!" },
          {
            type: "email",
            message: "Please input a valid email!",
            validateTrigger: "onChange", // onBlur is not working
          },
        ]}
        help={errors?.email}
        validateStatus={errors?.email ? "error" : ""}>
        <Input onChange={() => setErrors({ ...errors, email: undefined })} />
      </Form.Item>

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
  );
};

export default Register;
