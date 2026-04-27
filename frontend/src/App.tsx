import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";

const queryClient = new QueryClient();

export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#005f73",
          borderRadius: 10,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
