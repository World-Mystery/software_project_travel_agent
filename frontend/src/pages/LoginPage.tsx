import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchMe, login } from "../api/auth";
import { ApiError } from "../api/client";
import { useAuthStore } from "../store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (token) => {
      const me = await fetchMe(token.access_token);
      setSession(token.access_token, me);
      navigate((location.state as { from?: string } | null)?.from ?? "/");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Login failed");
    },
  });

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
            <Typography.Title level={2}>Login</Typography.Title>
            <Typography.Paragraph type="secondary">
              Sign in to create itineraries, check task progress, and review saved versions.
            </Typography.Paragraph>
          </div>
          {error ? <Alert type="error" showIcon message={error} /> : null}
          <Form layout="vertical" onFinish={(values) => mutation.mutate(values)}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="alice" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="secret123" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
              Continue
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
