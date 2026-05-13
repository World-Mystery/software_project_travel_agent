import React, { useState } from 'react';
import { Typography, Card, Row, Col, Space, Tag, Input, Select, Button, Table, Badge, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { mockPlanHistory } from '../utils/mockData';
import { 
  History, 
  MapPin, 
  Calendar, 
  Wallet, 
  Search,
  Filter,
  Activity,
  SunSnow,
  GitBranch
} from 'lucide-react';

const { Title, Text } = Typography;

export function PlanHistoryPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const stats = [
    { title: '总生成方案', value: mockPlanHistory.length },
    { title: '已规划城市', value: new Set(mockPlanHistory.map(p => p.city)).size },
    { title: '高风险预警', value: mockPlanHistory.filter(p => p.weatherRisk === '高').length },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <Space>
            <History size={28} color="#1890ff" />
            方案档案馆
          </Space>
        </Title>
        <Text type="secondary">查看、管理和回溯所有历史旅行方案与版本</Text>
      </div>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        {stats.map((stat, idx) => (
          <Col xs={24} sm={8} key={idx}>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <Statistic title={stat.title} value={stat.value} valueStyle={{ color: '#1890ff', fontWeight: 600 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} style={{ borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Space>
            <Input 
              placeholder="搜索城市或方案名称..." 
              prefix={<Search size={16} color="#bfbfbf" />} 
              style={{ width: 250, borderRadius: 8 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">所有风险等级</Select.Option>
              <Select.Option value="low">低风险</Select.Option>
              <Select.Option value="high">高风险</Select.Option>
            </Select>
            <Button icon={<Filter size={16} />}>更多筛选</Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {mockPlanHistory.filter(p => p.title.includes(searchText) || p.city.includes(searchText)).map(plan => (
            <Col xs={24} md={12} lg={8} key={plan.id}>
              <Card 
                hoverable
                style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
                onClick={() => navigate(`/plans/${plan.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{plan.title}</Title>
                    <Space size="small" style={{ marginTop: 4 }}>
                      <Tag color="blue" style={{ borderRadius: 4 }}>{plan.version}</Tag>
                      <Text type="secondary" style={{ fontSize: 13 }}>{plan.date}</Text>
                    </Space>
                  </div>
                  <Badge 
                    status={plan.weatherRisk === '高' ? 'error' : plan.weatherRisk === '中' ? 'warning' : 'success'} 
                  />
                </div>

                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
                    <Wallet size={16} style={{ marginRight: 8, color: '#8c8c8c' }} />
                    <Text>预算 ¥{plan.budget}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
                    <Activity size={16} style={{ marginRight: 8, color: '#8c8c8c' }} />
                    <Text>强度: {plan.intensity}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
                    <SunSnow size={16} style={{ marginRight: 8, color: '#8c8c8c' }} />
                    <Text>天气风险: {plan.weatherRisk}</Text>
                  </div>
                </Space>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="text" size="small" style={{ padding: 0, color: '#1890ff' }} icon={<GitBranch size={14} />} onClick={(e) => { e.stopPropagation(); navigate('/versions'); }}>
                    查看版本
                  </Button>
                  <Text type="secondary" style={{ fontSize: 12 }}>更新于 {(plan as any).updatedAt || plan.date}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}