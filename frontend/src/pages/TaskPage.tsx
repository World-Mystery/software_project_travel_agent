import React, { useEffect, useState } from 'react';
import { Typography, Card, Steps, Progress, Button, Row, Col, Space, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockTaskProgress } from '../utils/mockData';
import { CheckCircle2, Loader2, PlayCircle, Clock, ServerCog, Check } from 'lucide-react';

const { Title, Text } = Typography;

export function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [progressData, setProgressData] = useState(mockTaskProgress);
  const [percent, setPercent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Simulate progress
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < progressData.length) {
        setProgressData(prev => {
          const newData = [...prev];
          
          // mark previous running as success
          const runningIdx = newData.findIndex(item => item.status === 'running');
          if (runningIdx !== -1) {
            newData[runningIdx].status = 'success';
          }
          
          // set current to running if not already success
          if (newData[currentStep].status === 'waiting') {
            newData[currentStep].status = 'running';
            if (!newData[currentStep].log) {
              newData[currentStep].log = `正在执行：${newData[currentStep].title}...`;
            }
          }
          
          return newData;
        });
        
        setPercent(Math.floor(((currentStep + 1) / progressData.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [progressData.length]);

  const stepItems = progressData.map((item, index) => {
    let status: 'wait' | 'process' | 'finish' | 'error' = 'wait';
    if (item.status === 'success') status = 'finish';
    if (item.status === 'running') status = 'process';
    
    return {
      title: item.title,
      description: item.status === 'running' ? '进行中...' : item.status === 'success' ? '已完成' : '等待中',
      icon: status === 'process' ? <Loader2 className="animate-spin" size={24} color="#1890ff" /> : undefined
    };
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingTop: 20 }}>
      <Row gutter={24}>
        <Col span={24}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 16, 
              background: '#001529', 
              color: '#fff',
              marginBottom: 24,
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>
                  <Space>
                    <ServerCog size={28} />
                    Agent 流水线生成中
                  </Space>
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 8 }}>
                  系统正在多维度评估天气、预算与地理位置...
                </Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Progress 
                  type="circle" 
                  percent={percent} 
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  trailColor="rgba(255,255,255,0.1)"
                  format={(percent) => <span style={{ color: '#fff' }}>{percent}%</span>}
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title="生成节点" 
            bordered={false} 
            style={{ borderRadius: 16, height: '100%' }}
            bodyStyle={{ padding: '24px 24px 0 24px' }}
          >
            <Steps
              direction="vertical"
              current={progressData.findIndex(item => item.status === 'running')}
              items={stepItems}
            />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card 
            title="Agent 实时日志" 
            bordered={false} 
            style={{ borderRadius: 16, height: '100%', background: '#fafafa' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {progressData.filter(item => item.status !== 'waiting').map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  key={index}
                  style={{ 
                    padding: 16, 
                    background: item.status === 'running' ? '#e6f7ff' : '#fff',
                    border: `1px solid ${item.status === 'running' ? '#91d5ff' : '#f0f0f0'}`,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {item.status === 'success' ? (
                      <CheckCircle2 size={18} color="#52c41a" />
                    ) : (
                      <Loader2 size={18} color="#1890ff" className="animate-spin" />
                    )}
                  </div>
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong>{item.title}</Text>
                      <Tag color={item.status === 'success' ? 'green' : 'blue'} style={{ marginLeft: 8, border: 0 }}>
                        {item.status === 'success' ? 'Success' : 'Running'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 13 }}>{item.log}</Text>
                  </div>
                </motion.div>
              ))}
            </div>

            {isFinished && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  marginTop: 32, 
                  padding: 24, 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: 12,
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={48} color="#52c41a" style={{ marginBottom: 16 }} />
                <Title level={4}>方案已生成完毕</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                  已成功保存至历史版本 v1，您可以前往详情页查看或继续微调。
                </Text>
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ borderRadius: 8, background: '#13c2c2', borderColor: '#13c2c2' }}
                  onClick={() => navigate('/plans/mock-plan-2')}
                >
                  查看完整方案
                </Button>
              </motion.div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}