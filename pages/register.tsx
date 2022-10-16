import { Button, Form, Input, Typography } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import axios, { AxiosError } from "axios";

const { Title } = Typography;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",

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

  const onFinish = async (data: RegisterData) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", data);
      console.log(res);
    } catch (error: unknown | AxiosError) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
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
          help={errors.email}
          validateStatus={errors.email ? "error" : ""}>
          <Input onChange={() => setErrors({ ...errors, email: undefined })} />
        </Form.Item>

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
          help={errors.password}
          validateStatus={errors.password ? "error" : ""}>
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
          Or <Link href='/login'>login now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
