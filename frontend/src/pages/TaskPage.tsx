import { Alert, Card, Progress, Space, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTaskPolling } from "../hooks/useTaskPolling";

export function TaskPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const numericTaskId = Number(taskId);
  const taskQuery = useTaskPolling(numericTaskId, Number.isFinite(numericTaskId));

  useEffect(() => {
    if (taskQuery.data?.status === "success" && taskQuery.data.plan_id) {
      const timeout = window.setTimeout(() => navigate(`/plans/${taskQuery.data?.plan_id}`), 1200);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [navigate, taskQuery.data?.plan_id, taskQuery.data?.status]);

  return (
    <Card title={`Task #${taskId}`} style={{ borderRadius: 18 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph>
          The page polls the backend every 2 seconds until the task completes or fails.
        </Typography.Paragraph>
        <Progress percent={taskQuery.data?.progress ?? 0} status={taskQuery.data?.status === "failed" ? "exception" : "active"} />
        <Typography.Text>Status: {taskQuery.data?.status ?? "loading"}</Typography.Text>
        {taskQuery.data?.error_message ? (
          <Alert type="error" showIcon message={taskQuery.data.error_message} />
        ) : null}
        {taskQuery.data?.status === "success" ? (
          <Alert type="success" showIcon message="Task complete. Redirecting to the plan detail page..." />
        ) : null}
      </Space>
    </Card>
  );
}
