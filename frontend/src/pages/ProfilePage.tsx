import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Select, Space, Typography } from "antd";

import { fetchMyProfile, updateMyProfile } from "../api/profile";

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchMyProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });

  const profile = profileQuery.data?.profile;

  return (
    <Card title="My Travel Profile" style={{ borderRadius: 18 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {profileQuery.data?.profile_summary ? (
          <Alert type="info" showIcon message={profileQuery.data.profile_summary} />
        ) : null}
        <Form
          form={form}
          layout="vertical"
          initialValues={profile}
          key={JSON.stringify(profile ?? {})}
          onFinish={(values) => updateMutation.mutate({ ...values, interest_tags: splitTags(values.interest_tags) })}
        >
          <Form.Item name="travel_style" label="Travel style" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Leisure", value: "leisure" },
                { label: "Deep dive", value: "deep_dive" },
                { label: "Business", value: "business" },
              ]}
            />
          </Form.Item>
          <Form.Item name="budget_level" label="Budget level" rules={[{ required: true }]}>
            <Select options={[{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }]} />
          </Form.Item>
          <Form.Item
            name="interest_tags"
            label="Interest tags"
            getValueProps={(value) => ({ value: Array.isArray(value) ? value.join(", ") : value ?? "" })}
          >
            <Input placeholder="history, food, parks" />
          </Form.Item>
          <Form.Item name="transport_preference" label="Transport preference" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Public transit", value: "public_transit" },
                { label: "Taxi", value: "taxi" },
                { label: "Walk", value: "walk" },
              ]}
            />
          </Form.Item>
          <Form.Item name="accommodation_preference" label="Accommodation preference" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Budget", value: "budget" },
                { label: "Comfort", value: "comfort" },
                { label: "Premium", value: "premium" },
              ]}
            />
          </Form.Item>
          <Form.Item name="risk_sensitivity" label="Weather sensitivity" rules={[{ required: true }]}>
            <Select options={[{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }]} />
          </Form.Item>
          <Form.Item name="pace_preference" label="Pace preference" rules={[{ required: true }]}>
            <Select options={[{ label: "Slow", value: "slow" }, { label: "Balanced", value: "balanced" }, { label: "Compact", value: "compact" }]} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            Save profile
          </Button>
        </Form>
        {updateMutation.isSuccess ? <Typography.Text type="success">Profile updated.</Typography.Text> : null}
      </Space>
    </Card>
  );
}

function splitTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}
