import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPlan, listPlanVersions, regeneratePlan } from "../api/plans";
import { getPlanWarnings } from "../api/warnings";
import { WarningList } from "../components/WarningList";
import { getCurrentVersion, getPlanContent } from "../utils/plan";

type RegenerateValues = {
  title: string;
  city: string;
  dateRange: [Dayjs, Dayjs];
  budgetRange: string;
  transportPreference: string;
  accommodationPreference: string;
  notes?: string;
};

export function PlanDetailPage() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const numericPlanId = Number(planId);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [form] = Form.useForm<RegenerateValues>();

  const planQuery = useQuery({
    queryKey: ["plan", numericPlanId],
    queryFn: () => getPlan(numericPlanId),
    enabled: Number.isFinite(numericPlanId),
  });

  const versionsQuery = useQuery({
    queryKey: ["plan", numericPlanId, "versions"],
    queryFn: () => listPlanVersions(numericPlanId),
    enabled: Number.isFinite(numericPlanId),
  });

  const warningsQuery = useQuery({
    queryKey: ["plan", numericPlanId, "warnings"],
    queryFn: () => getPlanWarnings(numericPlanId),
    enabled: Number.isFinite(numericPlanId),
  });

  const regenerateMutation = useMutation({
    mutationFn: (values: RegenerateValues) =>
      regeneratePlan(numericPlanId, selectedVersionId ?? 0, {
        title: values.title,
        city: values.city,
        start_date: values.dateRange[0].format("YYYY-MM-DD"),
        end_date: values.dateRange[1].format("YYYY-MM-DD"),
        budget_range: values.budgetRange,
        transport_preference: values.transportPreference,
        accommodation_preference: values.accommodationPreference,
        notes: values.notes ?? "",
      }),
    onSuccess: (data) => {
      setRegenerateOpen(false);
      navigate(`/tasks/${data.task_id}`);
    },
  });

  const plan = planQuery.data;
  const version = plan ? getCurrentVersion(plan) : null;
  const content = plan ? getPlanContent(plan) : {};
  const defaultDates = useMemo<[Dayjs, Dayjs] | undefined>(() => {
    if (!plan) return undefined;
    return [dayjs(plan.start_date), dayjs(plan.end_date)];
  }, [plan]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        title={plan?.title ?? "Plan detail"}
        extra={
          <Button
            onClick={() => {
              if (plan && version) {
                setSelectedVersionId(version.id);
                setRegenerateOpen(true);
                form.setFieldsValue({
                  title: `${plan.title} refresh`,
                  city: plan.city,
                  budgetRange: plan.budget_range,
                  transportPreference: "public_transit",
                  accommodationPreference: "comfort",
                  dateRange: defaultDates,
                  notes: "",
                });
              }
            }}
          >
            Regenerate current version
          </Button>
        }
        style={{ borderRadius: 18 }}
      >
        {plan ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="City">{plan.city}</Descriptions.Item>
            <Descriptions.Item label="Dates">
              {plan.start_date} to {plan.end_date}
            </Descriptions.Item>
            <Descriptions.Item label="Budget">{plan.budget_range}</Descriptions.Item>
            <Descriptions.Item label="Current version">{plan.current_version_id ?? "none"}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={15}>
          <Card title="Itinerary content" style={{ borderRadius: 18 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Hotel">{content.hotel?.name ?? "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Estimated total">{content.budget?.estimated_total ?? "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Hotel area">{content.hotel?.location ?? "N/A"}</Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Days</Divider>
              <List
                dataSource={content.days ?? []}
                locale={{ emptyText: "No day schedule available." }}
                renderItem={(day) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${day.date}${day.theme ? ` · ${day.theme}` : ""}`}
                      description={
                        <Space direction="vertical">
                          {(day.activities ?? []).map((activity, index) => (
                            <Typography.Text key={`${day.date}-${index}`}>
                              {activity.time} · {activity.title}
                            </Typography.Text>
                          ))}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />

              <Divider orientation="left">Suggestions</Divider>
              <List
                dataSource={content.overall_suggestions ?? []}
                locale={{ emptyText: "No suggestions available." }}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card title="Weather warnings" style={{ borderRadius: 18 }}>
              {warningsQuery.data ? <WarningList data={warningsQuery.data} /> : <Alert type="info" message="Loading warnings..." />}
            </Card>
            <Card title="Version history" style={{ borderRadius: 18 }}>
              <List
                dataSource={versionsQuery.data ?? []}
                locale={{ emptyText: "No versions found." }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="regen"
                        type="link"
                        onClick={() => {
                          if (!plan || !defaultDates) return;
                          setSelectedVersionId(item.id);
                          setRegenerateOpen(true);
                          form.setFieldsValue({
                            title: `${plan.title} v${item.version_no + 1}`,
                            city: plan.city,
                            budgetRange: plan.budget_range,
                            transportPreference: "public_transit",
                            accommodationPreference: "comfort",
                            dateRange: defaultDates,
                            notes: "",
                          });
                        }}
                      >
                        Regenerate
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`v${item.version_no} · ${item.source_type}`}
                      description={item.change_summary}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>

      <Modal
        open={regenerateOpen}
        title="Regenerate from selected version"
        onCancel={() => setRegenerateOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={regenerateMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={(values) => regenerateMutation.mutate(values)}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dateRange" label="Dates" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="budgetRange" label="Budget" rules={[{ required: true }]}>
            <Select options={[{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }]} />
          </Form.Item>
          <Form.Item name="transportPreference" label="Transport" rules={[{ required: true }]}>
            <Select options={[{ label: "Public transit", value: "public_transit" }, { label: "Taxi", value: "taxi" }, { label: "Walk", value: "walk" }]} />
          </Form.Item>
          <Form.Item name="accommodationPreference" label="Accommodation" rules={[{ required: true }]}>
            <Select options={[{ label: "Budget", value: "budget" }, { label: "Comfort", value: "comfort" }, { label: "Premium", value: "premium" }]} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
