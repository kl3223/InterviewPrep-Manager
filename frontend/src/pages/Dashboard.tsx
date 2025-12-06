import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Progress, List, Typography, Statistic, Tag } from 'antd';
import { ClockCircleOutlined, BookOutlined, FileTextOutlined, CodeOutlined } from '@ant-design/icons';
import { dashboardApi } from '../services/api';
import { DashboardStats, TodayTasks } from '../types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<TodayTasks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, tasksResponse] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getTodayTasks()
        ]);
        setStats(statsResponse.data);
        setTodayTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>仪表盘</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总体完成度"
              value={stats.overall.completion_rate}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="%"
            />
            <Progress
              percent={stats.overall.completion_rate}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
              {stats.overall.completed_items} / {stats.overall.total_items} 项已完成
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="面试题库"
              value={stats.interview_questions.total}
              prefix={<BookOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              {Object.entries(stats.interview_questions.status_counts).map(([status, count]) => (
                <div key={status} style={{ marginBottom: 8 }}>
                  <Text style={{ marginRight: 8 }}>{status}:</Text>
                  <Tag color={getStatusColor(status)}>{count}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="知识点库"
              value={stats.knowledge_points.total}
              prefix={<FileTextOutlined />}
              suffix={`（${stats.knowledge_points.starred_count} 个收藏）`}
            />
            <div style={{ marginTop: 16 }}>
              {Object.entries(stats.knowledge_points.status_counts).map(([status, count]) => (
                <div key={status} style={{ marginBottom: 8 }}>
                  <Text style={{ marginRight: 8 }}>{status}:</Text>
                  <Tag color={getStatusColor(status)}>{count}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Statistic
              title="刷题题库"
              value={stats.coding_questions.total}
              prefix={<CodeOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Row gutter={16}>
                {Object.entries(stats.coding_questions.status_counts).map(([status, count]) => (
                  <Col key={status} span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Tag color={getStatusColor(status)} style={{ marginBottom: 8 }}>{status}</Tag>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{count}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="今日面试题复习" extra={<ClockCircleOutlined />}>
            <List
              dataSource={todayTasks?.interview_questions || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/interview-questions/${item.id}`}>{item.title}</a>}
                    description={<Tag>{item.category}</Tag>}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无需要复习的面试题' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="今日知识点重看" extra={<ClockCircleOutlined />}>
            <List
              dataSource={todayTasks?.knowledge_points || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/knowledge-points/${item.id}`}>{item.title}</a>}
                    description={<Tag>{item.category}</Tag>}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无需要重看的知识点' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="今日编程题复盘" extra={<ClockCircleOutlined />}>
            <List
              dataSource={todayTasks?.coding_questions || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`/coding-questions/${item.id}`}>{item.title}</a>}
                    description={<Tag>{item.category}</Tag>}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无需要复盘的编程题' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 辅助函数：根据状态返回不同的颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '未学': 'default',
    '已掌握': 'success',
    '需要复习': 'warning',
    '重要': 'error',
    '掌握': 'success',
    '重看': 'warning',
    '未做': 'default',
    '已做': 'success',
    '复盘': 'warning'
  };
  return colorMap[status] || 'default';
};

export default Dashboard;