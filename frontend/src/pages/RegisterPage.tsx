import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { register } from "../api/auth";

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Register failed");
    },
  });

  const onFinish = (values: RegisterFormValues) => {
    setError(null);
    mutation.mutate({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at top left, #94d2bd, #0a9396 45%, #001219 100%)",
      }}
    >
      <Card style={{ width: 420, borderRadius: 18 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Typography.Title level={2}>Register</Typography.Title>
            <Typography.Paragraph type="secondary">Create an account to start planning your trips.</Typography.Paragraph>
          </div>
          {error ? <Alert type="error" showIcon message={error} /> : null}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="alice" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="alice@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="secret123" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="secret123" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
              Create account
            </Button>
          </Form>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography.Paragraph>
        </Space>
      </Card>
    </div>
  );
}
