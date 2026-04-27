import { Alert, Space } from "antd";

import type { WeatherWarningResponse } from "../api/types";

type Props = {
  data: WeatherWarningResponse;
};

export function WarningList({ data }: Props) {
  if (!data.warnings.length) {
    return <Alert type="success" message="No active weather warnings for this plan." showIcon />;
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {data.warnings.map((warning: WeatherWarningResponse["warnings"][number], index: number) => (
        <Alert
          key={`${warning.date}-${warning.type}-${index}`}
          type={warning.level === "high" ? "error" : "warning"}
          showIcon
          message={`${warning.date} · ${warning.type}`}
          description={`${warning.impact}. ${warning.suggestion}`}
        />
      ))}
    </Space>
  );
}
