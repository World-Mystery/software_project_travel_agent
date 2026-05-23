import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { AppLayout } from "../components/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { PlanDetailPage } from "../pages/PlanDetailPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../pages/RegisterPage";
import { TaskPage } from "../pages/TaskPage";
import { PlanHistoryPage } from "../pages/PlanHistoryPage";
import { VersionHistoryPage } from "../pages/VersionHistoryPage";

function ProtectedShell() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <ProtectedShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskPage />,
      },
      {
        path: "plans/:planId",
        element: <PlanDetailPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "history",
        element: <PlanHistoryPage />,
      },
      {
        path: "versions",
        element: <VersionHistoryPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
