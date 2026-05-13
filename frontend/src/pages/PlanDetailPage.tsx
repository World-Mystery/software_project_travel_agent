import React, { useState } from 'react';
import { Typography, Card, Row, Col, Space, Tag, Button, Tabs, Divider, Drawer, Timeline } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockPlanDetail } from '../utils/mockData';
import { 
  Map, 
  SunSnow, 
  Wallet, 
  Activity, 
  Clock, 
  MapPin, 
  Coffee, 
  Camera, 
  Bus, 
  FileText,
  Wand2,
  History
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const { Title, Text, Paragraph } = Typography;

const COLORS = ['#13c2c2', '#1890ff', '#faad14', '#eb2f96'];

export function PlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = mockPlanDetail;

  const [activeDay, setActiveDay] = useState('1');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'attraction': return <Camera size={16} color="#1890ff" />;
      case 'food': return <Coffee size={16} color="#faad14" />;
      case 'transport': return <Bus size={16} color="#52c41a" />;
      default: return <MapPin size={16} color="#13c2c2" />;
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 40 }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(120deg, #e6f7ff 0%, #ffffff 100%)',
          borderRadius: 24,
          padding: '32px 40px',
          marginBottom: 24,
          position: 'relative',
          border: '1px solid #91d5ff'
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={2}>
              <Space>
                <Tag color="blue" style={{ borderRadius: 12 }}>{plan.version}</Tag>
                <Text type="secondary">{plan.date} 出发 • 共 {plan.days} 天</Text>
              </Space>
              <Title level={2} style={{ margin: '8px 0' }}>{plan.city} {plan.days} 日游</Title>
              <Space size="large" style={{ marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wallet size={16} color="#8c8c8c" /> 总预算 ¥{plan.totalBudget}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={16} color="#8c8c8c" /> {plan.pace}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><SunSnow size={16} color={plan.riskLevel === '低' ? '#52c41a' : '#faad14'} /> 天气风险：{plan.riskLevel}</span>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<FileText size={16} />}>导出 PDF</Button>
              <Button icon={<History size={16} />} onClick={() => navigate('/versions')}>版本历史</Button>
              <Button type="primary" icon={<Wand2 size={16} />} style={{ background: '#13c2c2', borderColor: '#13c2c2' }} onClick={() => setDrawerVisible(true)}>
                AI 优化
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      <Row gutter={24}>
        {/* Left / Middle: Timeline */}
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 16, marginBottom: 24 }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs 
              activeKey={activeDay}
              onChange={setActiveDay}
              style={{ padding: '0 24px' }}
              items={plan.itinerary.map(day => ({
                label: `Day ${day.day}`,
                key: String(day.day)
              }))}
            />
            
            <div style={{ padding: 24 }}>
              {plan.weather[Number(activeDay) - 1].suggestion && (
                <div style={{ marginBottom: 24, padding: '12px 16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, display: 'flex', gap: 8 }}>
                  <SunSnow size={20} color="#faad14" />
                  <Text style={{ color: '#d46b08' }}>
                    <strong>天气提示：</strong>
                    {plan.weather[Number(activeDay) - 1].suggestion}
                  </Text>
                </div>
              )}

              <Timeline
                items={plan.itinerary[Number(activeDay) - 1].items.map((item, idx) => ({
                  color: item.type === 'food' ? 'orange' : item.type === 'transport' ? 'green' : 'blue',
                  dot: <div style={{ background: '#fff', padding: 4, borderRadius: '50%', border: '2px solid #f0f0f0' }}>{getIconForType(item.type)}</div>,
                  children: (
                    <Card 
                      hoverable 
                      size="small" 
                      style={{ marginBottom: 16, borderRadius: 12, border: '1px solid #f0f0f0' }}
                    >
                      <Row justify="space-between">
                        <Col>
                          <Space align="center">
                            <Text strong style={{ fontSize: 16 }}>{item.time}</Text>
                            <Divider type="vertical" />
                            <Title level={5} style={{ margin: 0 }}>{item.title}</Title>
                          </Space>
                          <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 8 }}>
                            {item.reason}
                          </Paragraph>
                          <Space>
                            {item.tags.map(tag => (
                              <Tag key={tag} bordered={false} style={{ background: '#f5f5f5' }}>{tag}</Tag>
                            ))}
                          </Space>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#8c8c8c' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                              <Clock size={14} /> {item.duration}
                            </span>
                            {item.budget > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: '#52c41a' }}>
                                <Wallet size={14} /> ¥{item.budget}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  )
                }))}
              />
            </div>
          </Card>
        </Col>

        {/* Right: Summary & Map */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Mock Map */}
            <Card 
              bordered={false} 
              style={{ borderRadius: 16, overflow: 'hidden' }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ 
                height: 250, 
                background: '#e6f7ff', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'radial-gradient(#91d5ff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
                <Map size={48} color="#1890ff" opacity={0.2} />
                {/* Mock points */}
                <div style={{ position: 'absolute', top: '40%', left: '30%', width: 12, height: 12, background: '#1890ff', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(24,144,255,0.2)' }} />
                <div style={{ position: 'absolute', top: '60%', left: '50%', width: 12, height: 12, background: '#faad14', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(250,173,20,0.2)' }} />
                <div style={{ position: 'absolute', top: '30%', left: '70%', width: 12, height: 12, background: '#1890ff', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(24,144,255,0.2)' }} />
                
                {/* Mock lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 30% 40% L 50% 60% L 70% 30%" stroke="#1890ff" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity={0.5} />
                </svg>

                <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                  <Button size="small" style={{ borderRadius: 12 }}>查看大地图</Button>
                </div>
              </div>
            </Card>

            {/* Budget Panel */}
            <Card title="预算拆解" bordered={false} style={{ borderRadius: 16 }}>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plan.budgetBreakdown}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {plan.budgetBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `¥${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <Row gutter={[16, 16]}>
                {plan.budgetBreakdown.map((item, index) => (
                  <Col span={12} key={item.name}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index] }} />
                      <Text type="secondary">{item.name}</Text>
                      <Text strong>¥{item.value}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Weather Panel */}
            <Card title="天气预报" bordered={false} style={{ borderRadius: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {plan.weather.map((w, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx !== plan.weather.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Text>{w.day}</Text>
                    <Text>{w.condition}</Text>
                    <Text strong>{w.temp}</Text>
                    <Tag color={w.risk === '低' ? 'green' : 'orange'} style={{ margin: 0 }}>{w.risk}风险</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* AI Optimize Drawer */}
      <Drawer
        title="AI 行程优化"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card size="small" title="降低预算" hoverable style={{ border: '1px solid #91d5ff' }}>
            <Text type="secondary">将住宿降级为舒适型，餐饮替换为高性价比选项。预计可节省 ¥500。</Text>
            <Button type="primary" size="small" style={{ marginTop: 12 }}>应用</Button>
          </Card>
          <Card size="small" title="调整为长辈模式" hoverable>
            <Text type="secondary">减少每日步行距离，增加休息时间，剔除过于刺激的项目。</Text>
            <Button type="default" size="small" style={{ marginTop: 12 }}>应用</Button>
          </Card>
          <Card size="small" title="规避降雨" hoverable>
            <Text type="secondary">将 Day 2 下午的所有户外景点替换为博物馆或商场。</Text>
            <Button type="default" size="small" style={{ marginTop: 12 }}>应用</Button>
          </Card>
        </Space>
      </Drawer>
    </div>
  );
}