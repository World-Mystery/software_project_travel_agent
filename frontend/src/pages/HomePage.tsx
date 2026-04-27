import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, DatePicker, Form, Input, List, Row, Select, Space, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

import { createPlan, listPlans } from "../api/plans";

type HomeFormValues = {
  title: string;
  city: string;
  dateRange: [Dayjs, Dayjs];
  budgetRange: string;
  transportPreference: string;
  accommodationPreference: string;
  notes?: string;
};

export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<HomeFormValues>();

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: listPlans,
  });

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      navigate(`/tasks/${result.task_id}`);
    },
  });

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={10}>
        <Card title="Create a Trip Plan" style={{ borderRadius: 18 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              createMutation.mutate({
                title: values.title,
                city: values.city,
                start_date: values.dateRange[0].format("YYYY-MM-DD"),
                end_date: values.dateRange[1].format("YYYY-MM-DD"),
                budget_range: values.budgetRange,
                transport_preference: values.transportPreference,
                accommodation_preference: values.accommodationPreference,
                notes: values.notes ?? "",
              });
            }}
            initialValues={{
              budgetRange: "medium",
              transportPreference: "public_transit",
              accommodationPreference: "comfort",
              dateRange: [dayjs().add(7, "day"), dayjs().add(9, "day")],
            }}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input placeholder="Spring city break" />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input placeholder="Shanghai" />
            </Form.Item>
            <Form.Item name="dateRange" label="Travel dates" rules={[{ required: true }]}>
              <DatePicker.RangePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="budgetRange" label="Budget range" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ]}
              />
            </Form.Item>
            <Form.Item name="transportPreference" label="Transport" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Public transit", value: "public_transit" },
                  { label: "Taxi", value: "taxi" },
                  { label: "Walk", value: "walk" },
                ]}
              />
            </Form.Item>
            <Form.Item name="accommodationPreference" label="Accommodation" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Budget", value: "budget" },
                  { label: "Comfort", value: "comfort" },
                  { label: "Premium", value: "premium" },
                ]}
              />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={4} placeholder="Museums, city walks, and indoor backup options" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={createMutation.isPending}>
              Create async task
            </Button>
          </Form>
        </Card>
      </Col>
      <Col xs={24} xl={14}>
        <Card title="My Plans" style={{ borderRadius: 18 }}>
          <List
            loading={plansQuery.isLoading}
            dataSource={plansQuery.data ?? []}
            locale={{ emptyText: "No plans yet." }}
            renderItem={(plan) => (
              <List.Item
                actions={[
                  <Button key="view" type="link" onClick={() => navigate(`/plans/${plan.id}`)}>
                    View
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={plan.title}
                  description={
                    <Space direction="vertical" size={2}>
                      <Typography.Text>{plan.city}</Typography.Text>
                      <Typography.Text type="secondary">
                        {plan.start_date} to {plan.end_date} · budget {plan.budget_range}
                      </Typography.Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
