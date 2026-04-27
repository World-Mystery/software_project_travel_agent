import type { PropsWithChildren } from "react";
import { Layout, Menu, Space, Typography, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/auth";

const { Header, Content } = Layout;

export function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Layout style={{ minHeight: "100vh", background: "linear-gradient(180deg, #e0fbfc 0%, #f7f7f2 100%)" }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#001219" }}>
        <Space size="large">
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            Smart Travel Assistant
          </Typography.Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              { key: "/", label: <Link to="/">Dashboard</Link> },
              { key: "/profile", label: <Link to="/profile">Profile</Link> },
            ]}
            style={{ minWidth: 280, background: "transparent" }}
          />
        </Space>
        <Space>
          <Typography.Text style={{ color: "#e9f5f5" }}>{user?.username ?? "Guest"}</Typography.Text>
          <Button
            onClick={() => {
              clearSession();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
}
