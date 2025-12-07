import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import MarkdownEditor from '@uiw/react-markdown-editor';
import ReactMarkdown from 'react-markdown';
import { knowledgePointApi } from '../services/api';
import { KnowledgePoint } from '../types';

const { Option } = Select;

const KnowledgePoints: React.FC = () => {
  const [points, setPoints] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<KnowledgePoint | null>(null);
  const [searchText, setSearchText] = useState('');
  const [categorySearchText, setCategorySearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // 状态选项
  const statusOptions = ['未学', '掌握', '重看'];

  useEffect(() => {
    fetchPoints();
  }, [searchText, categorySearchText, selectedCategory, selectedStatus, showStarredOnly]);

  const fetchPoints = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchText) params.search = searchText;
      if (categorySearchText) params.category_search = categorySearchText;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (showStarredOnly) params.starred = true;
      
      const response = await knowledgePointApi.getAll(params);
      setPoints(response.data);
    } catch (error) {
      message.error('获取知识点库失败');
      console.error('Error fetching knowledge points:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentPoint(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (point: KnowledgePoint) => {
    setIsEditMode(true);
    setCurrentPoint(point);
    form.setFieldsValue(point);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditMode && currentPoint) {
        // 更新知识点
        await knowledgePointApi.update(currentPoint.id, values);
        message.success('知识点更新成功');
      } else {
        // 创建新知识点
        await knowledgePointApi.create(values);
        message.success('知识点创建成功');
      }
      
      setIsModalVisible(false);
      fetchPoints();
    } catch (error) {
      message.error('操作失败');
      console.error('Error handling form submission:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await knowledgePointApi.delete(id);
      message.success('知识点删除成功');
      fetchPoints();
    } catch (error) {
      message.error('删除失败');
      console.error('Error deleting knowledge point:', error);
    }
  };

  const toggleStar = async (id: number, currentStarred: boolean) => {
    try {
      await knowledgePointApi.toggleStar(id);
      message.success(currentStarred ? '已取消收藏' : '已收藏');
      fetchPoints();
    } catch (error) {
      message.error('操作失败');
      console.error('Error toggling star:', error);
    }
  };

  // 获取所有分类
  const categories = Array.from(new Set(points.map(p => p.category)));

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '收藏',
      dataIndex: 'starred',
      key: 'starred',
      render: (starred: boolean, record: KnowledgePoint) => (
        <Button
          type="text"
          icon={starred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={() => toggleStar(record.id, starred)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: KnowledgePoint) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>知识点库</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增知识点
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          placeholder="搜索知识点"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="搜索分类"
          prefix={<SearchOutlined />}
          value={categorySearchText}
          onChange={(e) => setCategorySearchText(e.target.value)}
          style={{ width: 150 }}
        />
        <Select
          placeholder="选择分类"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: 150 }}
        >
          <Option value="">全部</Option>
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
        <Select
          placeholder="选择状态"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: 150 }}
        >
          <Option value="">全部</Option>
          {statusOptions.map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
        <span style={{ marginRight: 8 }}>仅显示收藏：</span>
        <Switch
          checked={showStarredOnly}
          onChange={setShowStarredOnly}
        />
      </div>

      <Table
        columns={columns}
        dataSource={points}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
              <h4>内容：</h4>
              <ReactMarkdown>{record.content}</ReactMarkdown>
            </div>
          ),
        }}
      />

      <Modal
        title={isEditMode ? "编辑知识点" : "新增知识点"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '未学',
            starred: false,
            content: '',
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入知识点标题' }]}
          >
            <Input placeholder="请输入知识点标题" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Input placeholder="请输入分类" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              {statusOptions.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="starred"
            label="收藏"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容 (Markdown)"
            rules={[{ required: true, message: '请输入知识点内容' }]}
          >
            <MarkdownEditor
              value={form.getFieldValue('content') || ''}
              onChange={(value) => form.setFieldValue('content', value || '')}
              height="300px"
              style={{ borderRadius: 4, border: '1px solid #d9d9d9' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 辅助函数：根据状态返回不同的颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '未学': 'default',
    '掌握': 'success',
    '重看': 'warning'
  };
  return colorMap[status] || 'default';
};

export default KnowledgePoints;