import React, { useState } from 'react';
import { Typography, Card, Row, Col, Space, Tag, Timeline, Divider, Button } from 'antd';
import { mockVersionHistory } from '../utils/mockData';
import { 
  GitMerge, 
  GitCommit, 
  User, 
  Bot, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Minus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export function VersionHistoryPage() {
  const [activeVersion, setActiveVersion] = useState(mockVersionHistory[mockVersionHistory.length - 1]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <Space>
            <GitMerge size={28} color="#722ed1" />
            方案版本控制
          </Space>
        </Title>
        <Text type="secondary">成都 3 日游 - 版本演进历史</Text>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 16, height: '100%' }}>
            <Timeline
              items={mockVersionHistory.map((ver, idx) => ({
                color: ver.version === activeVersion.version ? '#722ed1' : 'gray',
                dot: <GitCommit size={16} color={ver.version === activeVersion.version ? '#722ed1' : '#bfbfbf'} />,
                children: (
                  <div 
                    style={{ 
                      cursor: 'pointer', 
                      padding: 12, 
                      borderRadius: 8,
                      background: ver.version === activeVersion.version ? '#f9f0ff' : 'transparent',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setActiveVersion(ver)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ color: ver.version === activeVersion.version ? '#722ed1' : 'inherit' }}>
                        {ver.version}
                      </Text>
                      <Tag color={ver.source.includes('AI') ? 'cyan' : 'blue'} style={{ border: 0 }}>
                        {ver.source.includes('AI') ? <Bot size={12} style={{ marginRight: 4 }} /> : <User size={12} style={{ marginRight: 4 }}/>}
                        {ver.source}
                      </Tag>
                    </div>
                    <Text style={{ display: 'block', margin: '8px 0', fontSize: 13 }}>{ver.summary}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{ver.createdAt}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <motion.div
            key={activeVersion.version}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>版本详情 {activeVersion.version}</Title>
                <Button type="primary" style={{ background: '#722ed1', borderColor: '#722ed1' }}>
                  恢复此版本
                </Button>
              </div>

              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Card size="small" style={{ background: '#fafafa', border: 'none' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>预算变化</Text>
                    <Space align="center">
                      <Text strong style={{ fontSize: 20, color: activeVersion.budgetChange > 0 ? '#cf1322' : activeVersion.budgetChange < 0 ? '#389e0d' : '#595959' }}>
                        {activeVersion.budgetChange > 0 ? '+' : ''}{activeVersion.budgetChange}
                      </Text>
                      {activeVersion.budgetChange > 0 ? <TrendingUp color="#cf1322" size={16} /> : activeVersion.budgetChange < 0 ? <TrendingDown color="#389e0d" size={16} /> : null}
                    </Space>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ background: '#fafafa', border: 'none' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>天气风险评估</Text>
                    <Tag color={activeVersion.riskChange === '低' ? 'green' : activeVersion.riskChange === '中' ? 'orange' : 'red'}>
                      {activeVersion.riskChange}
                    </Tag>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ background: '#fafafa', border: 'none' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>行程强度</Text>
                    <Text strong>{activeVersion.intensityChange}</Text>
                  </Card>
                </Col>
              </Row>

              <Divider orientation="left" plain>变更集 (Diff)</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Card size="small" title={<Space><Plus size={16} color="#52c41a" /> 新增节点</Space>} style={{ border: '1px solid #b7eb8f', background: '#f6ffed' }}>
                    {activeVersion.details.added.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {activeVersion.details.added.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : <Text type="secondary">无新增</Text>}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title={<Space><Minus size={16} color="#f5222d" /> 移除节点</Space>} style={{ border: '1px solid #ffa39e', background: '#fff1f0' }}>
                    {activeVersion.details.removed.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {activeVersion.details.removed.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : <Text type="secondary">无移除</Text>}
                  </Card>
                </Col>
              </Row>

              {activeVersion.details.reordered && (
                <div style={{ marginTop: 16, padding: 12, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RefreshCw size={16} color="#1890ff" />
                  <Text style={{ color: '#096dd9' }}>检测到行程顺序调整（优化路线合理性）</Text>
                </div>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}