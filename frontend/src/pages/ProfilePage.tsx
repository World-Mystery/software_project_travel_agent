import React from 'react';
import { Typography, Card, Row, Col, Space, Tag, Divider, Slider, Switch, message, Button } from 'antd';
import { mockUserProfile } from '../utils/mockData';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer, 
  PolarRadiusAxis 
} from 'recharts';
import { 
  User, 
  Settings, 
  Save, 
  Heart, 
  Compass, 
  Wallet, 
  Bus, 
  Home, 
  SunSnow, 
  Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

export function ProfilePage() {
  const profile = mockUserProfile;

  const handleSave = () => {
    message.success('偏好画像保存成功，将在下次规划时生效');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <Space>
              <User size={28} color="#eb2f96" />
              旅行偏好画像
            </Space>
          </Title>
          <Text type="secondary">您的偏好将作为 AI Agent 生成方案的核心基础</Text>
        </div>
        <Button type="primary" icon={<Save size={16} />} size="large" style={{ borderRadius: 8 }} onClick={handleSave}>
          保存画像
        </Button>
      </div>

      <Row gutter={24}>
        {/* Left Column: Radar and Interests */}
        <Col xs={24} md={10}>
          <Card bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>兴趣雷达</Title>
              <Tag color="magenta" style={{ borderRadius: 12, border: 0 }}>实时更新</Tag>
            </div>
            <div style={{ height: 300, width: '100%', marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profile.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="User" dataKey="A" stroke="#eb2f96" fill="#eb2f96" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <Divider orientation="left" plain>核心兴趣标签</Divider>
            <Space wrap>
              {profile.interests.map((tag, idx) => (
                <motion.div key={tag} whileHover={{ scale: 1.05 }}>
                  <Tag 
                    color="pink" 
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: 16, 
                      fontSize: 14, 
                      border: '1px solid #ffadd2',
                      background: '#fff0f6'
                    }}
                  >
                    {tag}
                  </Tag>
                </motion.div>
              ))}
              <Button type="dashed" size="small" style={{ borderRadius: 16 }} icon={<Settings size={12} />}>编辑</Button>
            </Space>
          </Card>

          <Card bordered={false} style={{ borderRadius: 16, background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' }}>
            <Space align="start">
              <BotIcon size={24} color="#52c41a" />
              <div>
                <Title level={5} style={{ margin: 0, color: '#237804' }}>系统画像摘要</Title>
                <Paragraph style={{ margin: 0, marginTop: 8, color: '#389e0d' }}>
                  {profile.summary}
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column: Detailed Preferences */}
        <Col xs={24} md={14}>
          <Card title="规划参数基准" bordered={false} style={{ borderRadius: 16 }}>
            <Row gutter={[24, 32]}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong><Space><Wallet size={16} /> 预算敏感度</Space></Text>
                </div>
                <Slider defaultValue={60} marks={{ 0: '穷游', 50: '适中', 100: '奢华' }} />
              </Col>
              
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong><Space><Activity size={16} /> 行程节奏</Space></Text>
                </div>
                <Slider defaultValue={30} marks={{ 0: '轻松', 50: '适中', 100: '特种兵' }} />
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong><Space><SunSnow size={16} /> 天气敏感度</Space></Text>
                </div>
                <Slider defaultValue={80} marks={{ 0: '无所谓', 50: '一般', 100: '高度敏感' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>分数越高，AI 越倾向于避开恶劣天气安排室外活动。</Text>
              </Col>
            </Row>

            <Divider dashed />

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card size="small" type="inner" title={<Space><Bus size={16}/> 交通偏好</Space>} style={{ background: '#fafafa' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>优先公共交通</Text>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>接受长时间步行</Text>
                      <Switch />
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card size="small" type="inner" title={<Space><Home size={16}/> 住宿偏好</Space>} style={{ background: '#fafafa' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>必须含早餐</Text>
                      <Switch defaultChecked />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>偏好特色民宿</Text>
                      <Switch defaultChecked />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const BotIcon = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);
