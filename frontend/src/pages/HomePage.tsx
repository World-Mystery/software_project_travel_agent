import React, { useState } from 'react';
import { Typography, Row, Col, Card, Input, Button, Tag, Space, Divider, message, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  SunSnow, 
  Activity,
  Briefcase,
  Coffee,
  Trees,
  Landmark,
  Compass,
  Zap,
  ShieldAlert,
  GitCommit,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockRecentPlans } from '../utils/mockData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export function HomePage() {
  const navigate = useNavigate();
  const [demandText, setDemandText] = useState('');
  const [parsed, setParsed] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Mock parsed state
  const [parsedData, setParsedData] = useState({
    destination: '',
    duration: '',
    budget: '',
    style: '',
  });

  const handleParse = () => {
    if (!demandText.trim()) {
      message.warning('请输入您的旅行想法');
      return;
    }
    setIsParsing(true);
    // Mock parsing delay
    setTimeout(() => {
      setParsedData({
        destination: '成都',
        duration: '3天',
        budget: '¥3000',
        style: '轻松休闲、美食优先',
      });
      setParsed(true);
      setIsParsing(false);
      message.success('需求解析成功');
    }, 1500);
  };

  const handleGenerate = () => {
    if (!parsed) {
      handleParse();
      return;
    }
    // Navigate to a task progress page
    navigate('/tasks/mock-task-123');
  };

  const applyTemplate = (template: string) => {
    setDemandText(template);
    setParsed(false);
  };

  const templates = [
    { title: '周末轻旅行', desc: '周边城市 2日游，避开人潮', icon: <Coffee size={20} color="#13c2c2" />, text: '我想去江浙沪周边度个周末，2天1晚，预算2000元，想要放松一点，不要太累，最好能喝喝咖啡逛逛老街。' },
    { title: '美食深度游', desc: '吃货专属打卡路线', icon: <Activity size={20} color="#fa8c16" />, text: '去成都吃吃吃，3天时间，预算3000，必须去吃苍蝇馆子和地道火锅，不怕排队。' },
    { title: '亲子舒适游', desc: '适合带娃，行程宽松', icon: <Users size={20} color="#eb2f96" />, text: '一家三口去三亚，4天时间，预算8000，宝宝5岁，行程要宽松，必须安排去海族馆或者水上乐园，酒店要好。' },
    { title: '高效打卡游', desc: '有限时间看最多风景', icon: <Zap size={20} color="#722ed1" />, text: '北京特种兵周末2日游，周五晚到周日晚回，想去故宫、长城、颐和园、天坛，预算不限。' },
    { title: '人文城市游', desc: '感受历史文化底蕴', icon: <Landmark size={20} color="#2f54eb" />, text: '西安4日游，预算4000，想深入了解大唐文化，去兵马俑、陕西历史博物馆、城墙，最好有夜游安排。' },
    { title: '自然放松游', desc: '亲近山水，远离喧嚣', icon: <Trees size={20} color="#52c41a" />, text: '想去大理或者桂林，亲近自然，5天时间，预算5000，不要去人挤人的网红点，想包车或者租车。' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #001529 0%, #003a4f 100%)',
          borderRadius: 24,
          padding: '48px 64px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 40,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ position: 'absolute', right: -50, top: -50, opacity: 0.1 }}>
          <Compass size={400} />
        </div>
        
        <Row align="middle" gutter={64}>
          <Col xs={24} md={14}>
            <Space direction="vertical" size="large">
              <Space>
                <Tag color="cyan" style={{ borderRadius: 12, padding: '4px 12px', border: 0 }}>v2.0 智能引擎</Tag>
                <Tag color="blue" style={{ borderRadius: 12, padding: '4px 12px', border: 0 }}>Agent 流水线</Tag>
              </Space>
              <Title level={1} style={{ color: '#fff', margin: 0, fontSize: 42 }}>
                让 AI 为你生成一份<br/>
                <span style={{ color: '#13c2c2' }}>真正可执行</span>的旅行计划
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 500, lineHeight: 1.6 }}>
                结合天气、预算、地图路线、个人偏好与历史版本，生成可调整、可追踪的完整行程。告别繁琐的攻略查阅。
              </Paragraph>
              
              <Space size="middle" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                  <ShieldAlert size={18} style={{ marginRight: 8, color: '#faad14' }} /> 天气风险约束
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                  <Wallet size={18} style={{ marginRight: 8, color: '#52c41a' }} /> 预算自动拆解
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                  <GitCommit size={18} style={{ marginRight: 8, color: '#1890ff' }} /> 多版本追踪
                </div>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Card 
              bordered={false} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                borderRadius: 20,
                color: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)' }}>行程预览示例</Text>
                <Badge status="processing" text={<span style={{ color: '#fff' }}>Agent Ready</span>} />
              </div>
              <Title level={3} style={{ color: '#fff', marginTop: 0 }}>成都 3 日游</Title>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>预算</Text>
                  <Text strong style={{ color: '#fff' }}>¥3,000</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>天气风险</Text>
                  <Text strong style={{ color: '#faad14' }}>中 (Day 2 阵雨)</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>行程节奏</Text>
                  <Text strong style={{ color: '#52c41a' }}>轻松</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>路线节点</Text>
                  <Text strong style={{ color: '#fff' }}>12 个</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Input Section */}
      <Row gutter={24} style={{ marginBottom: 40 }}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <Wand2 size={20} color="#1890ff" />
                <span>一句话生成您的专属行程</span>
              </Space>
            } 
            bordered={false} 
            style={{ borderRadius: 16, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <TextArea 
              rows={5} 
              placeholder="例如：我想去成都玩三天，预算3000左右，想吃地道火锅，行程不要太赶，如果下雨请帮我安排室内活动。"
              value={demandText}
              onChange={(e) => setDemandText(e.target.value)}
              style={{ borderRadius: 12, resize: 'none', marginBottom: 16, fontSize: 16, padding: 16 }}
            />
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button 
                    type="default" 
                    icon={<Activity size={16} />} 
                    onClick={handleParse}
                    loading={isParsing}
                    style={{ borderRadius: 8 }}
                  >
                    智能解析需求
                  </Button>
                </Space>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ArrowRight size={18} />} 
                  onClick={handleGenerate}
                  style={{ borderRadius: 8, background: '#13c2c2', borderColor: '#13c2c2' }}
                >
                  {parsed ? '开始生成完整方案' : '解析并生成方案'}
                </Button>
              </Col>
            </Row>

            <Divider dashed style={{ margin: '20px 0' }} />
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>推荐输入示例：</Text>
            <Row gutter={[12, 12]}>
              {templates.map((tpl, idx) => (
                <Col xs={12} sm={8} key={idx}>
                  <Card 
                    hoverable 
                    size="small" 
                    style={{ borderRadius: 12, background: '#fafafa', border: '1px solid #f0f0f0' }}
                    onClick={() => applyTemplate(tpl.text)}
                  >
                    <Space direction="vertical" size={2}>
                      <Space>
                        {tpl.icon}
                        <Text strong style={{ fontSize: 14 }}>{tpl.title}</Text>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>{tpl.desc}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            title="AI 解析结果" 
            bordered={false} 
            style={{ borderRadius: 16, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            {parsed ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f6ffed', padding: '12px 16px', borderRadius: 8 }}>
                    <CheckCircle2 size={20} color="#52c41a" style={{ marginRight: 12 }} />
                    <Text strong style={{ color: '#52c41a' }}>已成功提取关键信息</Text>
                  </div>
                  
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, color: '#8c8c8c' }}>
                          <MapPin size={14} style={{ marginRight: 4 }} /> 目的地
                        </div>
                        <Text strong style={{ fontSize: 16 }}>{parsedData.destination}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, color: '#8c8c8c' }}>
                          <Calendar size={14} style={{ marginRight: 4 }} /> 游玩时间
                        </div>
                        <Text strong style={{ fontSize: 16 }}>{parsedData.duration}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, color: '#8c8c8c' }}>
                          <Wallet size={14} style={{ marginRight: 4 }} /> 预算
                        </div>
                        <Text strong style={{ fontSize: 16 }}>{parsedData.budget}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, color: '#8c8c8c' }}>
                          <Compass size={14} style={{ marginRight: 4 }} /> 旅行风格
                        </div>
                        <Text strong style={{ fontSize: 16 }}>{parsedData.style}</Text>
                      </div>
                    </Col>
                  </Row>

                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>已附加偏好设置：</Text>
                    <Space wrap>
                      <Tag color="blue">优先避开恶劣天气</Tag>
                      <Tag color="green">公共交通为主</Tag>
                      <Tag color="cyan">酒店 ≥ 4星</Tag>
                    </Space>
                  </div>
                </Space>
              </motion.div>
            ) : (
              <div style={{ height: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf' }}>
                <Wand2 size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <Text type="secondary">输入旅行想法，AI 将自动提取核心要素</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Plans Section */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>最近生成的方案</Title>
        <Button type="link" onClick={() => navigate('/history')}>查看全部</Button>
      </div>
      
      <Row gutter={24}>
        {mockRecentPlans.map(plan => (
          <Col xs={24} md={8} key={plan.id}>
            <Card 
              hoverable
              style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f0' }}
              bodyStyle={{ padding: 0 }}
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <div style={{ height: 100, background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', padding: 20, position: 'relative' }}>
                <Title level={4} style={{ margin: 0 }}>{plan.title}</Title>
                <Text type="secondary">{plan.date}</Text>
                <Tag color="blue" style={{ position: 'absolute', top: 20, right: 10, borderRadius: 10 }}>{plan.version}</Tag>
              </div>
              <div style={{ padding: 20 }}>
                <Row gutter={[0, 12]}>
                  <Col span={12}>
                    <Space size="small">
                      <Wallet size={16} color="#8c8c8c" />
                      <Text>¥{plan.budget}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size="small">
                      <Activity size={16} color="#8c8c8c" />
                      <Text>{plan.intensity}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size="small">
                      <SunSnow size={16} color={plan.weatherRisk === '高' ? '#f5222d' : plan.weatherRisk === '中' ? '#faad14' : '#52c41a'} />
                      <Text>天气风险：{plan.weatherRisk}</Text>
                    </Space>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}